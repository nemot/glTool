#!/usr/bin/env ruby1.8
# -*- coding:utf-8 -*-
require 'rubygems'
require 'ru_propisju'
require 'writeexcel'
require 'config/environment'

min_year = Request.minimum('date_of_issue').year
max_year =  Request.maximum('date_of_issue').year

(min_year..max_year).each do |year|
  date_from = "01.01.#{year}".to_datetime
  date_to = "31.12.#{year}".to_datetime
  Client.all(:conditions=>"is_expeditor=true").each do |client|
    printf "#{year} - #{client.name} ...... "
#client = Client.find_by_id(13) # Уз желдор экспедиция
#date_from = "01.01.2010".to_datetime
#date_to = "31.12.2010".to_datetime

    # Ищем плейсы
    places = Place.all(
      :select => "DISTINCT places.*",
      :joins => "LEFT JOIN requests ON requests.id=places.id",
      :conditions=>"places.exp_id=#{client.id} AND 
        requests.date_of_issue BETWEEN '#{date_from.strftime('%Y-%m-%d')}' AND '#{date_to.strftime('%Y-%m-%d')}'",
      :order=>"requests.date_of_issue DESC"
    )
    # Делаем массив заявок
    place_ids = places.collect{|p| p.id }.uniq
    requests = Request.find(places.collect{|p| p.request_id }.uniq)

    # Создаем файл
    wb = WriteExcel.new("./lib/reports/expeditor/#{year}_#{client.id}.xls", :font=>"Calibri", :size=>11)
    sht = wb.add_worksheet "Отчет"

    # Название клиента и даты
    client_name_format = wb.add_format(:bold=>1, :size=>14)
    sht.merge_range("A1:AM1", client.name, client_name_format)
    date_color = wb.set_custom_color(39,"#993366")
    date_format = wb.add_format(:bold=>1, :italic=>1, :size=>18, :color=>date_color)
    sht.merge_range("A2:AM2", "#{date_from.strftime('%d.%m.%Y')} - #{date_to.strftime('%d.%m.%Y')}", date_format)

    # Заголовок
    header_color = wb.set_custom_color(40, "#FFCC99");
    header_format = wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color)

    hvals = ["Кодов","№ заявки","Дата выдачи","Клиент","Маршрут","Груз","Дата отгрузки","№ вагона","№ накладной","Вес","Тоннаж",
#    "РЕАЛ УТИ","РЕАЛ ТЖД","РЕАЛ КЗХ","РЕАЛ РЖД","РЕАЛ КРГ","РЕАЛ БЧ","РЕАЛ ТРК","ИТОГО РЕАЛЬН. СТ.",
    "УТИ","ТЖД","КЗХ","РЖД","КРГ","БЧ","ТРК","СТАВКА",
#    "ДЕЛЬТА СТАВКИ.",
    "ДОП.СБ",
#    "ИТОГО РЕАЛЬН", 
    "ИТОГО", 
#    "ИТОГО ДЕЛЬТА",
    "Подкод УТИ","Подкод ТЖД","Подкод КЗХ","Подкод РЖД","Подкод КРГ","Подкод БЧ","Подкод ТРК"]
    hvals.each_index do |i|
      sht.write(2,i,hvals[i],header_format)
    end
    sht.freeze_panes(3, 0);

    # Куча всяких нужных переменных
    monthes = ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"]
    month_ys = []
    y=3;
    month_header_format = wb.add_format(:bold=>1, :bg_color=>"yellow",:border=>1)
    month_footer_color = wb.set_custom_color(41,"#99CCFF");
    ddate_format = wb.add_format(:num_format=>"dd.mm.yy")
    invisible_format = wb.add_format(:color=>"white")
    start_month_y = 3; month_requests=[];
    country_column = {3=>11, 15=>12, 11=>13, 1=>14, 7=>15, 2=>16, 4=>17 } # ути, тжд, бч, кзх, ржд, трк, крг

    # Побежали по датам
    (date_from..date_to).each do |m|
      # Заголовок месяца
      if m.eql?(m.beginning_of_month)
        month_requests = requests.select{|r| r.date_of_issue>=m and r.date_of_issue<=(m+1.month-1.day) }
        unless month_requests.empty?
          sht.merge_range(y,0,y,27,monthes[m.month-1], month_header_format)
          y+=1; start_month_y = y;
        end
      end

      # Заявки в этот день
      day_requests = requests.select{|r| r.date_of_issue.eql?(m) }
      # Побежали по заявкам
      day_requests.each do |r|
        # Рассчет допсборов
        costs_jd_formula = "=";
        costs_for_car = r.costs.select{|c| place_ids.include?(c.place_id) }.select{|c| c.payment_type.eql?(1)}
        costs_for_car.each { |c| 
          costs_jd_formula<<"+" unless costs_for_car.first.eql?(c); costs_jd_formula << c.rate_jd.to_s; 
        }
        costs_jd_formula = 0 if costs_jd_formula.eql?("=")

        # Побежали по вагонам
        r.cars.each do |car|
          sht.write(y,0, (car.in_use ? 1 : 0));
          sht.write(y,1,r.id);
          sht.write_date_time(y,2,r.date_of_issue.xmlschema, ddate_format)
          sht.write(y,3,r.client_name)
          sht.write(y,4,"#{r.station_from_name} - #{r.station_to_name}")
          sht.write(y,5,"#{r.load_name}")
          sht.write_date_time(y,6,car.shipping_date.xmlschema, ddate_format) unless car.shipping_date.nil?
          sht.write(y,7,(car.in_use ? car.number : "Возврат"))
          sht.write(y,8,car.waybill)
          sht.write(y,9,car.weight)
          sht.write(y,10,car.tonnage)
          
          # Реальные ставки
          exp_codes = car.codes.select{|c| place_ids.include?(c.place_id) }
          country_column.each_pair do|country_id, column|
            codes = exp_codes.select{|c| c.place.country_id.eql?(country_id)}
#            sht.write(y, column, (car.in_use ? codes.first.rate_jd_real : 0)) unless codes.empty?
            sht.write(y, column, (car.in_use ? codes.first.rate_jd_real : 0)) unless codes.empty?
            sht.write(y, column+10, codes.first.number) unless codes.empty?
          end
          sht.write(y,18,"=SUM(L#{y+1}:R#{y+1})")
#          sht.write(y,26,"=SUM(T#{y+1}:Z#{y+1})")
#          sht.write(y,27,"=AA#{y+1}-S#{y+1}") # Дельта
          sht.write(y,19,costs_jd_formula) # Допсборы
#          sht.write(y,29,"=(S#{y+1}#{r.rate_for_car ? "" : "*K"+(y+1).to_s})+AC#{y+1}") # итого реальн
          sht.write(y,20,"=(S#{y+1}#{r.rate_for_car ? "" : "*K"+(y+1).to_s})+T#{y+1}") # итого ставка
#          sht.write(y,31,"=AE#{y+1}-AD#{y+1}") # итого дельта
          y+=1;
        end # EO цикла по вагонам
        # Разовые допсборы
        one_time_costs = r.costs.select{|c| place_ids.include?(c.place_id) }.select{|c| c.payment_type.eql?(0)};
        unless one_time_costs.empty?
          one_time_costs.each do |cost|
            sht.write(y,0,0,invisible_format);
            sht.write("T#{y+1}", cost.rate_jd);
            sht.write("U#{y+1}", "=T#{y+1}")
#            sht.write("AF#{y+1}",0)
            y+=1;
          end
        end
      end # EO цикла по заявкам


      # Итого за месяц
      if m.eql?(m.end_of_month.beginning_of_day) and !month_requests.empty?
        sht.write_formula(y,0,"=SUM(A#{start_month_y+1}:A#{y})",
          wb.add_format(:bold=>1, :align=>'center', :border=>1, :bg_color=>month_footer_color))
        sht.merge_range("B#{y+1}:T#{y+1}", 'Итого за месяц:', 
          wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color));
        sht.write_formula("U#{y+1}","=SUM(U#{start_month_y+1}:U#{y})",
          wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
#        sht.write_formula("AE#{y+1}","=SUM(AE#{start_month_y+1}:AE#{y})",
#          wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
#        sht.write_formula("AF#{y+1}","=AE#{y+1}-AD#{y+1}",
#          wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
        sht.merge_range("V#{y+1}:AB#{y+1}",'',wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
        month_ys.push(y);y+=1;
      end

    end # EO Цикл по датам

    total_codes="=0"; 
#    total_jd_real="=0";
    total_jd="=0";
    month_ys.each{ |i| 
      total_codes << "+A#{i+1}"; 
#      total_jd_real << "+AD#{i+1}"; 
      total_jd << "+U#{i+1}";
    }
    sht.write(y,0,total_codes, wb.add_format(:bold=>1, :align=>'center',:border=>1, :bg_color=>header_color))
#    sht.write("AD#{y+1}",total_jd_real, wb.add_format(:bold=>1, :align=>'right',:border=>1, :bg_color=>header_color))
    sht.write("U#{y+1}",total_jd, wb.add_format(:bold=>1, :align=>'right',:border=>1, :bg_color=>header_color))
#    sht.write("AF#{y+1}","=AE#{y+1}-AD#{y+1}", wb.add_format(:bold=>1, :align=>'right',:border=>1, :bg_color=>header_color))
    sht.merge_range("B#{y+1}:T#{y+1}", "Итого за год:", wb.add_format(:bold=>1, :align=>'right',:border=>1, :bg_color=>header_color))
    sht.merge_range("V#{y+1}:AB#{y+1}", "", wb.add_format(:bold=>1, :align=>'right',:border=>1, :bg_color=>header_color))


    wb.close

    printf("Готово\n")
  end #EO clients cicle
end # OE years cicle
 	  	  	  	  	  	  
