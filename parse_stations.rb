#!/usr/bin/env ruby1.8
# -*- coding:utf-8 -*-
require 'rubygems'
require 'config/environment'
#require 'net/http'
#require 'xpath'
#require 'rexml/document'
#include REXML

f = File.open('nf.txt','r')
counter = 0
last = 20016
failed = 0
while line = f.gets
  counter+=1;

  station = Station.find_by_name(line.split(";")[1].strip)
  railway = Railway.find_by_name(line.split(";")[2].strip)
  if station and railway
    station.railway_id = railway.id
    station.save!
    puts "#{(counter*100/last)}%% "
  else
    puts "FAILED!!!   !#{line.split(';')[1].strip}! !#{line.split(";")[2].strip}!"
    failed+=1;
  end
  
end
puts "Failed: #{failed} Total: #{counter}"
f.close

#last_page = 20429
#last_page = 10
#threads = []
#h = Net::HTTP.new("cargo.rzd.ru", 80)
#(1..last_page).each{|i|
##  threads << Thread.new(i) do |id|
#    begin
#      resp = h.get("/isvp/public/cargo?STRUCTURE_ID=5101&layer_id=4829&page4821_2705=1024&refererLayerId=4821&id=#{i}",nil)
#      station_code = resp.read_body.match(/(Краткое наименование станции\n\t\t\t<\/th><td>)(.*?)(<\/td>)/u)[2]
#      railway_name = resp.read_body.match(/(Наименование ЖД\n\t\t\t<\/th><td>)(.*?)(<\/td>)/u)[2]
#      f = File.open('./nf.txt','w')
#      f << station_code 
#      f << ";"
#      f << railway_name
#      f << "\n"
#      f.close


##      station = Station.find_by_name(station_code)
##      if station
##        printf "#{station.name}  ...."
##        
##        railway = Railway.find_by_name(railway_name)
##        if railway
##          station.railway_id = railway.id
##          station.save!
##          printf "Готово\n"
##        end
##      end
#    rescue
#      puts "#{id} Произошла какая-то ошибка!"
#    end
##  end # EO Thread
#}
#f.close
#threads.each {|thr| thr.join }



#doc = REXML::Document.new(resp.read_body)
##p resp.read_body.xpath("//table[@class='Gng']")
##p XPath.methods

#table = REXML::XPath.match(doc, "//table[@class='Gng']")

#puts table.inspect




#  threads << Thread.new(page_to_fetch) do |url|
#    h = Net::HTTP.new(url, 80)
#    puts "Fetching: #{url}"
#    resp = h.get('/', nil )    
#    puts "Got #{url}: #{resp.message}"
#  end

#threads.each {|thr| thr.join }
