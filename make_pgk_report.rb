#!/usr/bin/env ruby1.8
# -*- coding:utf-8 -*-
require 'rubygems'
require 'ru_propisju'
require 'writeexcel'
require 'config/environment'


client = Client.find_by_id(13) # ПГК
exit unless client.name.match(/ПГК/u) # МЕРА ПРЕДОСТОРОЖНОСТИ НА ВСЯКИЙ СЛУЧАЙ
(2009..Date.today.year).each{ |year|
  #date_from = "01.01.2010".to_datetime
  #date_to = "31.12.2010".to_datetime

  wb = WriteExcel.new("./lib/reports/pgk/#{year}.xls", :font=>"Calibri", :size=>11)

  header_gray_format = wb.add_format(:bold=>1, :bg_color=>"gray", :border=>1, :align=>'center', :valign=>"vcenter", :text_wrap=>1)
  header_gray_format_digit = wb.add_format(:bold=>1, :bg_color=>"gray", :border=>1, :align=>'center', :size=>16)
  header_yellow_format = wb.add_format(:bold=>1, :bg_color=>"yellow", :border=>1, :align=>'center')
  header_yellow_format_digit = wb.add_format(:bold=>1, :bg_color=>"yellow", :border=>1, :align=>'center', :size=>16)
  header_green_format = wb.add_format(:bold=>1, :bg_color=>"lime", :border=>1, :align=>'center')
  header_green_format_digit = wb.add_format(:bold=>1, :bg_color=>"lime", :border=>1, :align=>'center', :size=>16)
  blue_color = wb.set_custom_color(62,'#99CCFF');
  header_blue_format = wb.add_format(:bold=>1, :bg_color=>blue_color, :border=>1, :align=>'center')
  header_blue_format_digit = wb.add_format(:bold=>1, :bg_color=>blue_color, :border=>1, :align=>'center', :size=>16)

  monthes = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сенябрь","Окрябрь","Ноябрь","Декабрь"]

  monthes.each_index {|month_index|
    date_from = "01.#{(month_index+1 < 10) ? "0"+(month_index+1).to_s : (month_index+1)}.#{year}".to_datetime
    date_to = date_from.end_of_month

    sht = wb.add_worksheet monthes[month_index]  

    sht.merge_range("A1:I1","ОТПРАВЛЕНИЕ", header_gray_format);
    sht.merge_range("J1:U1","ТРАНЗИТ", header_yellow_format);
    sht.merge_range("V1:AB1","ПРИБЫТИЕ", header_green_format);
    sht.merge_range("AC1:AM1","ОТЧЕТНЫЕ ДАННЫЕ", header_blue_format);

    headers_grey = [
      "№ п/п","№ вагона","№ накладной","Дата приема груза к перевозке",
      "Код станции приема груза к перевозке",
      "Название станции приема груза к перевозке",
      "Код и подкод платильщика из графы 4 документа СМГС",
      "Код страны отправления груза",
      "Наименование страны отправления груза"
    ]
    headers_grey.each_index do |i|
      sht.write(1,i,headers_grey[i],
        wb.add_format(:bold=>1, :bg_color=>"gray", :border=>1, :align=>'center', :valign=>"vcenter", :text_wrap=>1))
      sht.write(2,i,i+1,header_gray_format_digit)
    end

    headers_yellow = [
      "Дата приема груза на транзитную дорогу",
      "Код транзитной дороги приема груза",
      "Наименование транзитной дороги приема груза",
      "Код пограничной станции входа груза",
      "Наименование пограничной станции входа груза",
      "Код пограничной станции выхода груза",
      "Наименование пограничной станции выхода груза",
      "Код страны следования (транзит)",
      "Наименование страны следования(транзит)",
      "Код дороги сдачи груза",
      "Наименование дороги сдачи груза",
      "Дата сдачи груза"
    ]
    headers_yellow.each_index do |i|
      sht.write(1,i+9,headers_yellow[i],
        wb.add_format(:bold=>1, :bg_color=>"yellow", :border=>1, :align=>'center', :valign=>"vcenter", :text_wrap=>1))
      sht.write(2,i+9,i+10,header_yellow_format_digit)
    end

    headers_green = [
      "Код страны назначения груза",
      "Наименование страны назначения груза",
      "Код дороги назначения груза",
      "Наименование дороги назначения груза",
      "Код станции назначения груза",
      "Дата раскредитования перевозочного документа",
      "Наименование станции назначения груза"
    ]

    headers_green.each_index do |i|
      sht.write(1,i+21,headers_green[i],
        wb.add_format(:bold=>1, :bg_color=>"lime", :border=>1, :align=>'center', :valign=>"vcenter", :text_wrap=>1))
      sht.write(2,i+21,i+22,header_green_format_digit)
    end

    headers_blue = [
      "Код груза ГНГ",
      "Наименование груза ГНГ",
      "Код груза ЕТСНГ",
      "Наименование груза ЕТСНГ",
      "Подкод экспедитора",
      "Принадлежность вагона (код собственника вагона)",
      "Фактический вес",
      "Расчетный вес",
      "Ставка",
      "Сумма к оплате",
      "Доп. сборы",
    ]
    headers_blue.each_index do |i|
      sht.write(1,i+28,headers_blue[i],
        wb.add_format(:bold=>1, :bg_color=>blue_color, :border=>1, :align=>'center', :valign=>"vcenter", :text_wrap=>1))
      sht.write(2,i+28,i+29,header_blue_format_digit)
    end
    sht.set_row(1,127.5)
    sht.freeze_panes(3, 0);
    # Конец ШАПКИ

    y=3
    # Ищем заявки
    requests = Request.all(
      :conditions=>"date_of_issue BETWEEN '#{date_from.strftime('%Y-%m-%d')}'
        AND '#{date_to.strftime('%Y-%m-%d')}' AND client_id=#{client.id}", 
      :order=>"date_of_issue DESC"
    )

    requests.each do |r|
      
      r.cars.each do |car|
        sht.write(y,0,y-2)
        sht.write(y,1,car.number)
        sht.write(y,2,car.waybill)
        sht.write(y,3,car.shipping_date)
        sht.write(y,4,r.station_from.code)
        sht.write(y,5,r.station_from.name)
        sht.write(y,6,'') # TODO Код и подкод плательщика из графы 4 документа СМГС
        sht.write(y,7, r.station_from.country.code) # TODO Код страны отправления груза
        sht.write(y,8, r.station_from.country.short_name)


        unless r.transit_stations.empty?          
          sht.write(y,10, r.transit_stations.first.railway.code) if r.transit_stations.first.railway
          sht.write(y,11, r.transit_stations.first.railway.name) if r.transit_stations.first.railway
          if r.transit_stations.length.eql?(1) # Of only one station
            sht.write(y,12, r.transit_stations.first.code)
            sht.write(y,13, r.transit_stations.first.name)
          end
          sht.write(y,14, r.transit_stations.last.code)
          sht.write(y,15, r.transit_stations.last.name)
          sht.write(y,16, r.transit_stations.last.country.code)
          sht.write(y,17, r.transit_stations.last.country.short_name)

          sht.write(y,18, r.transit_stations.last.railway.code) if r.transit_stations.last.railway
          sht.write(y,19, r.transit_stations.last.railway.name) if r.transit_stations.last.railway
        end # EO transit_stations empty check
        

        sht.write(y,21,r.station_to.country.code)
        sht.write(y,22,r.station_to.country.short_name)
        if r.station_to.railway
          sht.write(y,23,r.station_to.railway.code)
          sht.write(y,24,r.station_to.railway.short_name)
        end
        sht.write(y,25,r.station_to.code)
        sht.write(y,27,r.station_to.name)

        if r.load
          sht.write(y,28,r.load.gng) unless r.load.id.eql?(1)
          sht.write(y,29,r.load.name) unless r.load.gng.empty?
          sht.write(y,30,r.load.etsng) unless r.load.id.eql?(1)
          sht.write(y,31,r.load.name) unless r.load.etsng.empty? or r.load.id.eql?(1)
          if r.load.id.eql?(1)
            sht.write(y,34,1)
            sht.write(y,35,1)
          else
            sht.write(y,34,car.weight.to_f.round(2))
            sht.write(y,35,car.tonnage)
          end
        end    
        sht.write(y,36,car.rate_client)
        sht.write(y,37,"=AK#{y+1}*AJ#{y+1}")
        costs = 0
        sht.write(y,38,r.costs.collect{|c| c.payment_type.eql?(1) ? c.rate_client : 0 }.sum) # Только за вагон
        y+=1;
      end # EO Cars

    end # EO Requests
  } #EO monthes cicle
  wb.close
} #EO years cicle


