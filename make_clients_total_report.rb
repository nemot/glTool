#!/usr/bin/env ruby1.8
# -*- coding:utf-8 -*-
require 'rubygems'
require 'ru_propisju'
require 'writeexcel'
require 'config/environment'

min_year = Request.minimum('date_of_issue').year
max_year =  Request.maximum('date_of_issue').year

[true, false].each do |show_delta| # Цикл по дельте
  (min_year..max_year).each do |year|
    date_from = "01.01.#{year}".to_datetime
    date_to = "31.12.#{year}".to_datetime

    wb = WriteExcel.new("./lib/reports/client#{show_delta ? '/delta' : ''}/#{year}.xls", :font=>"Calibri", :size=>11)
    client_monthes = {}

    Client.all.each do |client|
      printf "#{year} - #{client.name} ...... "
      client_monthes.merge!({client.id=>[]})
      requests = Request.all(
        :conditions=>"date_of_issue BETWEEN '#{date_from.strftime('%Y-%m-%d')}' AND '#{date_to.strftime('%Y-%m-%d')}' AND client_id=#{client.id}", 
        :order=>"date_of_issue DESC"
      )

      sht = wb.add_worksheet client.id.to_s


      # Название клиента и даты
      client_name_format = wb.add_format(:bold=>1, :size=>14)
      sht.write("B1", client.name, client_name_format)
      date_color = wb.set_custom_color(39,"#993366")
      date_format = wb.add_format(:bold=>1, :italic=>1, :size=>18, :color=>date_color)
      sht.write("B2", "#{date_from.strftime('%d.%m.%Y')} - #{date_to.strftime('%d.%m.%Y')}", date_format)

      # Заголовок
      header_color = wb.set_custom_color(40, "#4F81BD");
      header_format = wb.add_format(:bold=>1, :border=>1, :align=>"center", :text_wrap=>1, :bg_color=>header_color, :valign=>'vcenter', :color=>'white')
      
      sht.merge_range("K2:Q2","СТАВКА ЖД", 
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.merge_range("R2:T2","СТАВКИ", 
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.merge_range("U2:V2","ДСБ.", 
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.merge_range("W2:Y2","ИТОГО", 
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.merge_range("Z2:Z3","ДОХОД", 
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.merge_range("AA2:AA3","ДЕЛЬТА", 
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white')) if show_delta
      sht.merge_range("AB2:AH2","ПОДКОДЫ", 
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      hvals = ["КОДОВ","№ ЗАЯВК.","ДАТА ВЫДАЧИ","МАРШРУТ","ГРУЗ","ДАТА ОТГР.","№ ВАГОНА","НАКЛАДНАЯ","ВЕС","ТНЖ", 
        
        "УТИ","ТДЖ","БЧ","КЗХ","РЖД","ТРК","КРГ",
        "ЖД","GR", "КЛ",
        "ЖД","КЛ",
        "ЖД","GR","КЛ",'','',
        "УТИ","ТДЖ","БЧ","КЗХ","РЖД","ТРК","КРГ",
      ];
      hvals.each_index do |i|
        sht.write(2,i,hvals[i],header_format) unless hvals[i].empty?
      end
      sht.freeze_panes(3, 0);

      monthes = ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"]
      month_ys = []
      y=3;
      month_header_format = wb.add_format(:bold=>1, :bg_color=>"yellow",:border=>1)
      month_footer_color = wb.set_custom_color(41,"#99CCFF");
      #month_footer_format = wb.add_format(:bold=>1, :align=>'center', :border=>1, :bg_color=>month_footer_color)
      ddate_format = wb.add_format(:num_format=>"dd.mm.yy")
      invisible_format = wb.add_format(:color=>"white")
      start_month_y = 3; month_requests=[]
      # Побежали по датам
      (date_from..date_to).each do |m|
        # Заголовок месяца
        if m.eql?(m.beginning_of_month)
          month_requests = requests.select{|r| r.date_of_issue>=m and r.date_of_issue<=(m+1.month-1.day) }
          unless month_requests.empty?
            sht.merge_range(y,0,y,33,monthes[m.month-1], month_header_format)
            y+=1; start_month_y = y;
          end
        end
        day_requests = requests.select{|r| r.date_of_issue.eql?(m) }
        # Побежали по заявкам
        day_requests.each do |r|
          # Рассчет допсборов
          costs_jd_formula = "="; costs_client_formula = "=";
          costs_for_car = r.costs.select{|c| c.payment_type.eql?(1)}
          costs_for_car.each { |c| 
            costs_jd_formula<<"+" unless costs_for_car.first.eql?(c); costs_jd_formula << c.rate_jd.to_s; 
            costs_client_formula<<"+" unless costs_for_car.first.eql?(c); costs_client_formula << c.rate_client.to_s; 
          }
          costs_jd_formula = 0 if costs_jd_formula.eql?("=")
          costs_client_formula = 0 if costs_client_formula.eql?("=")
          

          # Побежали по вагонам
          r.cars.each do |car|
            sht.write(y,0, (car.in_use ? 1 : 0));
            sht.write(y,1,r.id);
            sht.write_date_time(y,2,r.date_of_issue.xmlschema, ddate_format)
            sht.write(y,3,"#{r.station_from_name} - #{r.station_to_name}")
            sht.write(y,4,"#{r.load_name}")
            sht.write_date_time(y,5,car.shipping_date.xmlschema, ddate_format) unless car.shipping_date.nil?
            sht.write(y,6,(car.in_use ? car.number : "Возврат"))
            sht.write(y,7,car.waybill)
            sht.write(y,8,car.weight)
            sht.write(y,9,car.tonnage)
            # Коды
            country_column = {3=>10, 15=>11, 11=>12, 1=>13, 7=>14, 2=>15, 4=>16 } # ути, тжд, бч, кзх, ржд, трк, крг
            rate_jd_formula = ""; rate_client_formula = "";
            car.codes.each do |code|
              unless country_column[code.place.country_id].nil?
                sht.write(y,country_column[code.place.country_id], code.rate_jd_real );
                sht.write(y,country_column[code.place.country_id]+17, code.number );
              end
              if car.in_use
                rate_jd_formula << "+"+code.rate_jd.to_s unless code.rate_jd.to_i.eql?(0)
                rate_client_formula << "+"+code.rate_client.to_s unless code.rate_client.to_i.eql?(0)
              end
            end
            # Пишем ставки
            rate_jd_formula = rate_jd_formula.empty? ? car.rate_jd : ("="+rate_jd_formula.gsub(/^[+]/,''))
            rate_client_formula = rate_client_formula.empty? ? car.rate_client : ("="+rate_client_formula.gsub(/^[+]/,''))
            sht.write_formula(y,17,"=SUM(K#{y+1}:Q#{y+1})") # СТАВКА ЖД
            sht.write(y,18,rate_jd_formula) # СТАВКА GREENLINE
            sht.write(y,19,rate_client_formula) # СТАВКА КЛИЕНТУ
            # Доп сборы
            sht.write(y,20,costs_jd_formula) # ЖД
            sht.write(y,21,costs_client_formula) # КЛ
            # Суммы
            sht.write(y,22,"=(R#{y+1}#{r.rate_for_car ? "" : "*J"+(y+1).to_s})+U#{y+1}") # ЖД
            sht.write(y,23,"=(S#{y+1}#{r.rate_for_car ? "" : "*J"+(y+1).to_s})+U#{y+1}") # GREENLINE
            sht.write(y,24,"=(T#{y+1}#{r.rate_for_car ? "" : "*J"+(y+1).to_s})+V#{y+1}") # КЛИЕНТУ
            # ДОХОД и ДЕЛЬТА
            profit_formula = r.load_id.eql?(1) ? "=Y#{y+1}-X#{y+1}" : "=X#{y+1}-W#{y+1}"
            delta_formula = r.load_id.eql?(1) ? "=X#{y+1}-W#{y+1}" : "=Y#{y+1}-X#{y+1}"
            sht.write(y,25, profit_formula) # ДОХОД
            sht.write(y,26, delta_formula) if show_delta # ДЕЛЬТА

            y+=1;
          end
          # Разовые допсборы
          one_time_costs = r.costs.select{|c| c.payment_type.eql?(0)};
          unless one_time_costs.empty?
            one_time_costs.each do |cost|
              sht.write(y,0,0,invisible_format);
              # Доп сборы
              sht.write(y,20,cost.rate_jd);
              sht.write(y,21,cost.rate_client);
              # Суммы
              sht.write(y,22,"=U#{y+1}")
              sht.write(y,23,"=U#{y+1}")
              sht.write(y,24,"=V#{y+1}")
              # Доход дельта
              sht.write(y,25,"=Y#{y+1}-X#{y+1}")
              sht.write(y,26,0)
              y+=1;
            end
          end
        end
        # Итого за месяц
        if m.eql?(m.end_of_month.beginning_of_day) and !month_requests.empty?
          sht.write_formula(y,0,"=SUM(A#{start_month_y+1}:A#{y})", # Кодов
            wb.add_format(:bold=>1, :align=>'center', :border=>1, :bg_color=>month_footer_color))
          sht.merge_range(y,1,y,21, 'Итого за месяц:', 
            wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color));
          sht.write_formula(y,22,"=SUM(W#{start_month_y+1}:W#{y})", # ИТОГО ЖД
            wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
          sht.write_formula(y,23,"=SUM(X#{start_month_y+1}:X#{y})", # ИТОГО GR
            wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
          sht.write_formula(y,24,"=SUM(Y#{start_month_y+1}:Y#{y})", # ИТОГО КЛ
            wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
          sht.write_formula(y,25,"=SUM(Z#{start_month_y+1}:Z#{y})", # Доход
            wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
          sht.write_formula(y,26,"=SUM(AA#{start_month_y+1}:AA#{y})", # Дельта
            wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color))
          sht.merge_range(y,27,y,33, '', 
            wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>month_footer_color));
          month_ys.push(y);y+=1;
          client_monthes[client.id].push(y)
        end
      end

      # ИТОГИ ЗА ГОД
      total_codes="=0"; total_jd="=0"; total_client="=0"; total_gr="=0"; total_profit="=0"; total_delta="=0";
      month_ys.each{|i| total_codes << "+A#{i+1}"; total_jd << "+W#{i+1}"; total_gr << "+X#{i+1}"; 
        total_client << "+Y#{i+1}"; total_profit << "+Z#{i+1}"; total_delta << "+AA#{i+1}";
      }
      sht.write_formula(y,0,total_codes, # Кодов
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.merge_range(y,1,y,21, 'ИТОГО ЗА ГОД:', 
        wb.add_format(:bold=>1, :align=>'right', :border=>1, :bg_color=>header_color, :color=>'white'));
      sht.write_formula(y,22, total_jd, # ИТОГО ЖД
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.write_formula(y,23, total_gr, # ИТОГО GR
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.write_formula(y,24, total_client, # ИТОГО КЛ
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.write_formula(y,25,total_profit, # Доход
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.write_formula(y,26,total_delta, # Дельта
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'))
      sht.merge_range(y,27,y,33, '', 
        wb.add_format(:bold=>1, :border=>1, :align=>"center", :bg_color=>header_color, :valign=>'vcenter', :color=>'white'));

      sht.set_column("AA:AA",nil,nil,1) unless show_delta
      printf("Готово\n")
    end #EO clients cicle

    printf "#{year} - СВОД ...... "
    sht = wb.add_worksheet "Свод#{year}"
    header_format = wb.add_format(:border=>2, :bold=>1, :align=>'center', :valign=>'vcenter', :text_wrap=>1)
    bold_format = wb.add_format(:bold=>1, :border=>1, :align=>'center')
    bordered_format = wb.add_format(:left=>2, :right=>2, :top=>1, :bottom=>1)
    normal_format = wb.add_format(:border=>1)
    normal_number_format = wb.add_format(:border=>1,:align=>'right')
    
    sht.write("B1","#{year} год", wb.add_format(:bold=>1, :size=>18, :align=>'center'))

    sht.merge_range("A2:A4","№ п/п", header_format)
    sht.merge_range("B2:B4","Наимен.", header_format)
    sht.merge_range("C2:E2","Выставлено всего", header_format)
    sht.merge_range("C3:C4","Коды шт.", header_format)
    sht.merge_range("D3:D4","Клиенту", header_format)
    sht.merge_range("E3:E4","ML", header_format)
    sht.merge_range("F2:F4","Доход всего", header_format)
    
    monthes = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
    x=6; monthes.each do |month_name|
      sht.merge_range(1,x,1,x+2,month_name, header_format)
      sht.merge_range(2,x,  3,x,  "Коды шт.", header_format)
      sht.merge_range(2,x+1,3,x+1,"Клиенту", header_format)
      sht.merge_range(2,x+2,3,x+2,"ML", header_format)
      sht.merge_range(1,x+3,3,x+3,"Доход всего", header_format)
      x+=4;
    end
    
    y=4;
    ls = ("A".."CC").to_a
    Client.all.each do |client|
      sht.write(y,0,y-3, bold_format)
      sht.write_url(y,1,"internal:'#{client.id}'!A1", client.name, bordered_format)
      sht.write(y,2,"=#{ls[6]}#{y+1}+#{ls[6+4]}#{y+1}+#{ls[6+8]}#{y+1}+#{ls[6+12]}#{y+1}+#{ls[6+16]}#{y+1}+#{ls[6+20]}#{y+1}+#{ls[6+24]}#{y+1}+#{ls[6+28]}#{y+1}+#{ls[6+32]}#{y+1}+#{ls[6+36]}#{y+1}+#{ls[6+40]}#{y+1}+#{ls[6+44]}#{y+1}", normal_number_format)
      sht.write(y,3,"=#{ls[7]}#{y+1}+#{ls[7+4]}#{y+1}+#{ls[7+8]}#{y+1}+#{ls[7+12]}#{y+1}+#{ls[7+16]}#{y+1}+#{ls[7+20]}#{y+1}+#{ls[7+24]}#{y+1}+#{ls[7+28]}#{y+1}+#{ls[7+32]}#{y+1}+#{ls[7+36]}#{y+1}+#{ls[7+40]}#{y+1}+#{ls[7+44]}#{y+1}", normal_number_format)
      sht.write(y,4,"=#{ls[8]}#{y+1}+#{ls[8+4]}#{y+1}+#{ls[8+8]}#{y+1}+#{ls[8+12]}#{y+1}+#{ls[8+16]}#{y+1}+#{ls[8+20]}#{y+1}+#{ls[8+24]}#{y+1}+#{ls[8+28]}#{y+1}+#{ls[8+32]}#{y+1}+#{ls[8+36]}#{y+1}+#{ls[8+40]}#{y+1}+#{ls[8+44]}#{y+1}", normal_number_format)
      sht.write(y,5,"=#{ls[9]}#{y+1}+#{ls[9+4]}#{y+1}+#{ls[9+8]}#{y+1}+#{ls[9+12]}#{y+1}+#{ls[9+16]}#{y+1}+#{ls[9+20]}#{y+1}+#{ls[9+24]}#{y+1}+#{ls[9+28]}#{y+1}+#{ls[9+32]}#{y+1}+#{ls[9+36]}#{y+1}+#{ls[9+40]}#{y+1}+#{ls[9+44]}#{y+1}",bordered_format)

       monthes.each_index do |mi|
         sht.write(y,(mi*4+6),(client_monthes[client.id][mi] ? "='#{client.id}'!A#{client_monthes[client.id][mi]}" : 0), normal_number_format)
         sht.write(y,(mi*4+7),(client_monthes[client.id][mi] ? "='#{client.id}'!Y#{client_monthes[client.id][mi]}" : 0), normal_number_format)
         sht.write(y,(mi*4+8),(client_monthes[client.id][mi] ? "='#{client.id}'!X#{client_monthes[client.id][mi]}" : 0), normal_number_format)
         sht.write(y,(mi*4+9),(client_monthes[client.id][mi] ? "='#{client.id}'!Z#{client_monthes[client.id][mi]}" : 0), bordered_format)
       end
      y+=1;
    end #EO clients cicle
    monthes.each_index do |mi|
      sht.write(y,(mi*4+6),"=SUM(#{ls[mi*4+6]}5:#{ls[mi*4+6]}#{y})", header_format)
      sht.write(y,(mi*4+7),"=SUM(#{ls[mi*4+7]}5:#{ls[mi*4+7]}#{y})", header_format)
      sht.write(y,(mi*4+8),"=SUM(#{ls[mi*4+8]}5:#{ls[mi*4+8]}#{y})", header_format)
      sht.write(y,(mi*4+9),"=SUM(#{ls[mi*4+9]}5:#{ls[mi*4+9]}#{y})", header_format)
    end

    sht.write(y,0,'',header_format)
    sht.write(y,1,'Итого',header_format)
    sht.write(y,2,"=#{ls[6]}#{y+1}+#{ls[6+4]}#{y+1}+#{ls[6+8]}#{y+1}+#{ls[6+12]}#{y+1}+#{ls[6+16]}#{y+1}+#{ls[6+20]}#{y+1}+#{ls[6+24]}#{y+1}+#{ls[6+28]}#{y+1}+#{ls[6+32]}#{y+1}+#{ls[6+36]}#{y+1}+#{ls[6+40]}#{y+1}+#{ls[6+44]}#{y+1}", header_format)
    sht.write(y,3,"=#{ls[7]}#{y+1}+#{ls[7+4]}#{y+1}+#{ls[7+8]}#{y+1}+#{ls[7+12]}#{y+1}+#{ls[7+16]}#{y+1}+#{ls[7+20]}#{y+1}+#{ls[7+24]}#{y+1}+#{ls[7+28]}#{y+1}+#{ls[7+32]}#{y+1}+#{ls[7+36]}#{y+1}+#{ls[7+40]}#{y+1}+#{ls[7+44]}#{y+1}", header_format)
    sht.write(y,4,"=#{ls[8]}#{y+1}+#{ls[8+4]}#{y+1}+#{ls[8+8]}#{y+1}+#{ls[8+12]}#{y+1}+#{ls[8+16]}#{y+1}+#{ls[8+20]}#{y+1}+#{ls[8+24]}#{y+1}+#{ls[8+28]}#{y+1}+#{ls[8+32]}#{y+1}+#{ls[8+36]}#{y+1}+#{ls[8+40]}#{y+1}+#{ls[8+44]}#{y+1}", header_format)
    sht.write(y,5,"=#{ls[9]}#{y+1}+#{ls[9+4]}#{y+1}+#{ls[9+8]}#{y+1}+#{ls[9+12]}#{y+1}+#{ls[9+16]}#{y+1}+#{ls[9+20]}#{y+1}+#{ls[9+24]}#{y+1}+#{ls[9+28]}#{y+1}+#{ls[9+32]}#{y+1}+#{ls[9+36]}#{y+1}+#{ls[9+40]}#{y+1}+#{ls[9+44]}#{y+1}",header_format)
    
    sht.freeze_panes(4, 2)
    sht.set_column("B:B",35)
    sht.set_column("A:A",5)
    sht.set_first_sheet
    sht.activate
    

    wb.close
    printf("Готово\n")
  end # OE years cicle
end # EO delta cicle  	  	  	  

