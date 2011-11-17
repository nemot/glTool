#!/usr/bin/env ruby1.8
# -*- coding:utf-8 -*-
require 'rubygems'
require 'ru_propisju'
require 'writeexcel'
require 'config/environment'



#template = StringIO.new(File.open('./lib/invoice_template.xls').read)

bill = Bill.last

wb = WriteExcel.new('./newinvoice.xls', :font=>"TimesDL", :size=>10, :bg_color=>'white')
sht = wb.add_worksheet "Invoice"


# Номер инвойса
sht.write_string('E1', "Invoice № #{bill.number}",  wb.add_format(:size=>14, :bold=>1, :align=>'center')  )
# Дата создания
sht.write_string('E2', "Dated  #{bill.created_at.strftime("%d.%m.%Y")}", wb.add_format(:align=>'center') )
# № Договора
sht.write('D3', "по Договору  №#{bill.client.contract_number} от #{bill.client.contract_date.strftime('%d.%m.%Y')}" )

# Форматы для рамок
fb_top = wb.add_format(:top=>2)
fb_bottom = wb.add_format(:bottom=>2)
fb_right = wb.add_format(:right=>2)
fb_right_top = wb.add_format(:right=>2, :top=>2)
fb_right_bottom = wb.add_format(:right=>2, :bottom=>2)
payment_details_format = wb.add_format(:bold=>1, :left=>2)
bottom_left_border_format = wb.add_format(:bold=>1, :bottom=>2, :left=>2)
top_left_border_format = wb.add_format(:bold=>1, :top=>2, :left=>2);

# Делаем рамку для реквизитов
[["F",4,"I",17], ["A",4,"D",17]].each do |a|
  (a[0]..a[2]).each{|c| sht.write_blank("#{c}#{a[1]}",fb_top) }
  (a[0]..a[2]).each{|c| sht.write_blank("#{c}#{a[3]}", fb_bottom) }
  ((a[1]+1)..(a[3]-1)).each{|c| sht.write_blank("#{a[2]}#{c}",fb_right)}
  sht.write_blank("#{a[2]}#{a[1]}",fb_right_top)
  sht.write_blank("#{a[2]}#{a[3]}",fb_right_bottom)
end

# И собственно сами реквизиты
payment_details = bill.client.payment_details.gsub(/(\t)/,'').split("\n");
greenline_details = ["Beneficiary: “GREENLINE TRANS LLP”", "ID Number: OC 328387",
"Cornwall Buildings, 45-51 Newhall Street, office 330 ", 
" Birmingham, West Midlands, B3 3QR Great Britain", " (United Kingdom)",
"Acc. No.  LV 97 RTMB 0000 608 806 809  (USD)",
"Bank of beneficiary:  “RIETUMU BANKA”, ", "7 Vesetas Str., Riga, LV–1013, Latvija", "SWIFT:RTMBLV2X",
"Corr. bank: “ J.P. MORGAN CHASE BANK”  ", "New York, 11245 USA", "Correspondent Acc No: 400230518 SWIFT: CHASUS 33", "", ""];
{"A"=>greenline_details, "F"=>payment_details}.each_pair do |y,details| i=4;
  details.each do |v|
    f = payment_details_format
    f = top_left_border_format if i.eql?(4);
    f = bottom_left_border_format if i.eql?(4-1+details.length)
    sht.write_string("#{y}#{i}", v, f )
    i+=1;
  end
end

# Форматы для основной формы
ft_top = wb.add_format(:top=>2, :left=>1, :bold=>1, :align=>'center')
ft_vat = wb.add_format(:top=>2, :left=>1, :bold=>1, :align=>'center', :bottom=>1)
ft_top_left = wb.add_format(:top=>2, :left=>2, :bold=>1, :align=>'center')
ft_top_right = wb.add_format(:top=>2, :left=>1, :right=>2, :bold=>1, :align=>'center')
fm_left = wb.add_format(:left=>2, :bottom=>1, :bold=>1, :align=>'center')
fm_right = wb.add_format(:left=>1, :right=>2, :bottom=>1, :bold=>1, :align=>'center')
fm = wb.add_format(:left=>1, :bottom=>1, :bold=>1, :align=>'center')

fm2 = wb.add_format(:left=>1, :bottom=>2, :top=>1, :align=>'center')
fm2_left = wb.add_format(:left=>2, :bottom=>2, :top=>1, :align=>'center')
fm2_right = wb.add_format(:left=>1, :right=>2, :bottom=>2, :top=>1, :align=>'center')



# Заголовок для инвойса
x=18; 
vs = ["№", "Scopes of services", "Quantity", "Amount", "Price", "Cost of",'', '', "Total"]
vs.each_index do |i|
  unless vs[i].empty?
    f = ft_top; f = ft_top_left if i.eql?(0); f = ft_top_right if i.eql?(vs.length-1)
    sht.write(x, i, vs[i], f)
  end
end
sht.merge_range("G#{x+1}:H#{x+1}", 'VAT', ft_vat)
x+=1;
vs = ['', '', '', '', '', 'services', 'Rate', 'Sum', 'sum']
vs.each_index{|i| f = fm; f = fm_left if i.eql?(0); f = fm_right if i.eql?(vs.length-1);
  sht.write(x, i, vs[i], f)
}
x+=1;
vs = ['',1,2,3,4,5,6,7,8]
vs.each_index{ |i| f = fm2; f = fm2_left if i.eql?(0); f = fm2_right if i.eql?(vs.length-1);
  sht.write(x, i, vs[i], f)
}
x+=1;

x_start_formula = x;

# ------------------- САМ РАССЧЕТ ---------------------
fff_center = wb.add_format(:left=>1, :bottom=>1, :align=>'center');
fff_center_money = wb.add_format(:left=>1, :bottom=>1, :align=>'center');
fff_center_money.set_num_format('$#,##0.00');
fff_center_right_money = wb.add_format(:left=>1, :bottom=>1,:right=>2, :align=>'center');
fff_center_right_money.set_num_format('$#,##0.00');
fff = wb.add_format(:left=>1, :bottom=>1); fff_left = wb.add_format(:left=>2, :bottom=>1);
fff_right = wb.add_format(:left=>1, :right=>2, :bottom=>1)

sht.write_blank(x,0,fff_left);
dates_x = x;

(2..8).each{|i| sht.write_blank(x,i,(i.eql?(8) ? fff_right : fff))}
x+=1;

date_of_issue = Date.new((Time.now+20.years).to_i); valid_until = Date.new(0);

# Побежали по заявкам!
bill.requests.each do |request|
  
  date_of_issue = request.date_of_issue if request.date_of_issue <= date_of_issue
  valid_until = request.valid_until if valid_until <= request.valid_until
  
  # Номер и название
  sht.write(x,0, (bill.requests.index(request)+1).to_s+".", fff_left)
  if(request.load_id.eql?(1)) # Если порожняк
    cell_str = "Возврат порожнего вагона №"
    request.cars.each{|car|  cell_str+= car.number; cell_str+= ", " unless request.cars.last.eql?(car) }
  else
    cell_str = "Груз - #{request.load.name}"
  end
  sht.write(x,1,cell_str, fff)
  (2..8).each{|i| i.eql?(8) ? sht.write_blank(x,i,fff_right) : sht.write_blank(x,i, fff) }
  x+=1;

  # Территории
  sht.write_blank(x,0,fff_left);
  cell_str = "Территории "
  request.places.each{|p| cell_str += p.country_short_name; cell_str += ', ' unless p.eql?(request.places.last) }
  sht.write(x,1,cell_str, fff);
  (2..8).each{|i| i.eql?(8) ? sht.write_blank(x,i,fff_right) : sht.write_blank(x,i, fff) }
  x+=1;

  # Станция отправления и назначения и ставки
  sht.write_blank(x,0,fff_left);
  sht.write(x,1,"#{request.station_from_name} - #{request.station_to_name}", fff);
  sht.write(x,2, (request.rate_for_car ? request.cars_num : request.common_tonnage), fff_center);
  sht.write(x,3, (request.rate_for_car ? "vag" : "MT"), fff_center);
  sht.write(x,4, request.cars.first.rate_client ,fff_center_money)
  sht.write_formula(x,5, "=C#{x+1}*E#{x+1}" ,fff_center_money)
  sht.write_blank(x,6,fff);sht.write_blank(x,7,fff);
  sht.write_formula(x,8, "=F#{x+1}" ,fff_center_right_money)
  x+=1;

  # Доп сборы
  unless request.costs.empty?
    sht.write_blank(x,0,fff_left);
    sht.write(x,1,"Дополнительные сборы", fff);
    costs_rate = request.costs.collect{|c| c.rate_client}
    sht.write(x,2, 1, fff_center); sht.write_blank(x,3,fff);
    sht.write(x,4, costs_rate ,fff_center_money)
    sht.write_formula(x,5, "=C#{x+1}*E#{x+1}" ,fff_center_money)
    sht.write_blank(x,6,fff);sht.write_blank(x,7,fff);
    sht.write_formula(x,8, "=F#{x+1}" ,fff_center_right_money)
  end
  
  x+=1;
end
sht.write_blank(x,0,fff_left);sht.write_blank(x,8,fff_right);
(1..7).each{|i| sht.write_blank(x,i,fff)}

x+=1;

# Итого
ff1 = wb.add_format(:left=>1, :align=>'center', :size=>14);
ff1_money = wb.add_format(:left=>1, :right=>2, :align=>'center', :size=>14);
ff1_money.set_num_format('$#,##0.00');
ff1_left = wb.add_format(:left=>2, :size=>14);

sht.write_blank(x,0,ff1_left); sht.write(x,1, 'Total', ff1);
(2..7).each{|i| sht.write_blank(x,i,ff1)}
sht.write_formula(x,8,"=SUM(I#{x_start_formula+1}:I#{x})", ff1_money)
x+=1;

# Выставляем даты
sht.write(dates_x,1,"Период #{date_of_issue.strftime("%d.%m.%Y")} - #{valid_until.strftime("%d.%m.%Y")}", wb.add_format(:left=>1, :bottom=>1, :bold=>1));

# ------------------- САМ РАССЧЕТ ---------------------


# Делаем футер
ff_top_left = wb.add_format(:left=>2, :top=>2, :bottom=>1)
ff_top_right = wb.add_format(:left=>1, :right=>2, :top=>2, :bottom=>1)
ff_top = wb.add_format(:left=>1, :top=>2, :bottom=>1)
ff = wb.add_format(:left=>1, :bottom=>1)
ff_left = wb.add_format(:left=>2, :bottom=>1)
ff_right = wb.add_format(:left=>1, :bottom=>1, :right=>2)
ff_bottom = wb.add_format(:left=>1, :bottom=>2)
ff_bottom_left = wb.add_format(:left=>2, :bottom=>2)
ff_bottom_right = wb.add_format(:left=>1, :right=>2, :bottom=>2)

(0..8).each{ |col| f = ff_top; f = ff_top_left if col.eql?(0); f = ff_top_right if col.eql?(8);
  sht.write(x, col, '', f)
};x+=1;

sht.write(x, 0, '', ff_left); sht.write(x, 1, '', ff);
sht.merge_range("C#{x+1}:F#{x+1}", 'C O N T R A C T  P R I C E ', 
  wb.add_format(:left=>1, :bottom=>1, :bold=>1, :align=>'center', :size=>14));
sht.write(x, 6, '', ff);sht.write(x, 7, '', ff);sht.write(x, 8, '', ff_right);
x+=1;
sht.write(x, 0, '', ff_left); sht.write(x, 1, '', ff);
sht.merge_range("C#{x+1}:F#{x+1}", 'All bank charges at the expencse of the buyer.', 
  wb.add_format(:left=>1, :bottom=>1, :bold=>1, :align=>'center', :size=>10));
sht.write(x, 6, '', ff);sht.write(x, 7, '', ff);sht.write(x, 8, '', ff_right);
x+=1;
(0..8).each{ |col| f = ff; f = ff_left if col.eql?(0); f = ff_right if col.eql?(8);
  sht.write(x, col, '', f)
};x+=1;

(0..8).each {|col|  f = ff_bottom; f = ff_bottom_left if col.eql?(0); f = ff_bottom_right if col.eql?(8);
  sht.write(x, col, '', f)
}; x+=1;

# Total row
ftotal = wb.add_format(:top=>2, :bottom=>2, :bold=>1, :size=>11)
ftotal_left = wb.add_format(:left=>2, :top=>2, :bottom=>2)
ftotal_right = wb.add_format(:right=>2, :top=>2, :bottom=>2)
sht.write_blank(x,0,ftotal_left);
sht.write(x, 1,'Total for payment :',ftotal);
bill_sum = bill.summ-(bill.summ%1);
summ_str = RuPropisju.propisju(bill_sum).humanize
summ_str += " "+RuPropisju.choose_plural(bill_sum, 'доллар', 'доллара', 'долларов') + " США и "
summ_str += "#{((bill.summ%1)*100).round} центов";
summ_str = summ_str.mb_chars
summ_str[0] = summ_str[0].upcase.to_s
summ_str = summ_str.to_s
sht.write(x, 2, summ_str ,ftotal);
(3..7).each{|i| sht.write_blank(x,i,ftotal) }
sht.write_blank(x,8,ftotal_right);
sht.set_row(x, 17.25)
x+=1; x+=1;

ff_text = wb.add_format(:bold=>1, :size=>12)
sht.write(x,1, 'Директор', ff_text); x+=1;
sht.write(x,1, 'О. Абдусаматов', ff_text);

sht.insert_image(x-2, 2, './lib/stamp.png', -50,5, 1.17,1);


# Выставляем ширину столбцов
sht.set_column('A:A', 2.37)
sht.set_column('B:B', 29.33)
sht.set_column('C:C', 8)
sht.set_column('D:D', 12)
sht.set_column('E:E', 9.5)
sht.set_column('F:F', 13.17)
sht.set_column('G:G', 7.5)
sht.set_column('H:H', 11.67)
sht.set_column('I:I', 24)

# Параметры печати
sht.set_margins_TB(1.91/2.55)
sht.set_margins_LR(0.64/2.55)
sht.set_print_scale(85)

wb.close




