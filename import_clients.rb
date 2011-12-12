#!/usr/bin/env ruby1.8
# -*- coding:utf-8 -*-
require 'rubygems'
require 'config/environment'
require 'mysql'

begin
  # connect to the MySQL server
  dbh = Mysql.real_connect("localhost", "root", "Gimler12", "final_development", 3306, '/var/run/mysqld/mysqld.sock')
rescue Mysql::Error => e
  puts "Error code: #{e.errno}"
  puts "Error message: #{e.error}"
  puts "Error SQLSTATE: #{e.sqlstate}" if e.respond_to?("sqlstate")
end
dbh.query("SET NAMES utf8")

printf "Importing clients ... "
# IMPORTING CLIENTS
clients_index = {}
res = dbh.query("SELECT * FROM clients")
while row = res.fetch_hash do
  cpres = dbh.query("SELECT * FROM clientpersons WHERE client_id=#{row["id"]}")
  client_person = cpres.fetch_hash
  client = Client.create({
    :name => row["name"],
    :address => row["address_actual"]||"",
    :phone => row["phone"]||"",
    :email => row["email"]||"",
    :director => (client_person.nil? ? "" : client_person["fio"]),
    :payment_details => "",
    :is_expeditor => row["isExpeditor"],
    :contract_number => "",
    :contract_date => Date.today,
    :balance_client => 0
  })
  clients_index.merge!({row["id"]=>client.id})
  cpres.free
end
printf "DONE (%s)\n", res.num_rows
res.free

# IMPORTING REQUESTS
res = dbh.query("SELECT * FROM statements")
i=1; total = res.num_rows.to_i
while row = res.fetch_hash do
  puts "#{i*100/total}% #{i} of #{total}"
  if !row["from_stations_id"].nil? and !row["to_stations_id"].nil? and !row["loads_id"].nil?
    request = Request.create({
      :client_id=>clients_index[row["client_id"]],
      :station_from_id => row["from_stations_id"],
      :station_to_id => row["to_stations_id"],
      :load_id => (row["loads_id"].eql?("-1") ? 1 : row["loads_id"].to_i+1),
      :date_of_issue => row["date_from"].to_datetime,
      :valid_until => row["date_to"].to_datetime,
      :type_of_transportation => row["carriage_type"],
      :ownership => row["stock_accessory"].mb_chars.upcase.to_s,
      :car_type_id => row["car_type_id"].to_i,
      :sender => row["sender"],
      :receiver => row["receiver"],
      :gu12 => row["gu12"],
      :rate_for_car => row["rate_type"].to_i.eql?(0),
      :client_sum => row["rate_client"].to_f,
      :jd_sum => row["rate_jd"].to_f,
      :cars_num => row["car_count"].to_i,
      :common_tonnage => row["weight"].to_i,
      :has_invoice => true,
      :payed => true,
      :created_user_id => 1
    })
    places_index = {}
    # WITH PLACES
    places_res = dbh.query("SELECT * FROM statementplaces WHERE statement_id=#{row["id"]}")
    while place_row = places_res.fetch_hash do  
      unless clients_index[place_row["client_id"]].nil?
        place = Place.create({
          :request_id=>request.id, 
          :country_id=>place_row["country_id"].to_i, 
          :exp_id=>clients_index[place_row["client_id"]],
        })
        places_index.merge!({place_row["id"]=>place.id})
        # AND COSTS
        costs_res = dbh.query("SELECT * FROM statementcosts WHERE place_id=#{place_row["id"]}")
        while cost_row = costs_res.fetch_hash do
          Cost.create({
            :place_id=>place.id, 
            :name=>cost_row["cost_type"]||"", 
            :rate_jd=>(cost_row["cost_in"]).to_f, 
            :rate_client=>(cost_row["cost_out"]).to_f,
            :payment_type=>[1,2,0][(cost_row["amount_type"]||0).to_i]
          })
        end
        costs_res.free
      end
    end
    places_res.free
    
    # AND CARS
    cars_res = dbh.query("SELECT * FROM statement_cars WHERE statement_id=#{row["id"]}")
    while car_row = cars_res.fetch_hash do
      car = Car.create({
        :request_id => request.id,
        :in_use => car_row["inUse"].eql?("1"),
        :number => (car_row["number"]||""),
        :tonnage => car_row["tonnage"].to_i,
        :weight => car_row["weight"].to_i,
        :shipping_date => car_row["shipment_date"],
        :waybill => car_row["waybill_number"]||"",
        :rate_jd_real => (car_row["rate_jd"]||0).to_f,
        :rate_jd => (car_row["rate_jd"]||0).to_f,
        :rate_client => (car_row["rate_client"]||0).to_f
      })
      # AND CODES
      codes_res = dbh.query("SELECT * FROM codes WHERE car_id=#{car_row["id"]}");
      while code_row = codes_res.fetch_hash do 
        unless places_index[code_row["place_id"]].nil?
          Code.create({
            :car_id => car.id, 
            :place_id => places_index[code_row["place_id"]],
            :number => code_row["number"]||"",
            :rate_jd_real => (code_row["rate_jd"]||0).to_f,
            :rate_jd => (code_row["rate_jd"]||0).to_f,
            :rate_client => (code_row["rate_client"]||0).to_f,
          })
        end
      end
      codes_res.free
    end
    cars_res.free

    
  end
  i+=1;
end
res.free

