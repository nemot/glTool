#!/usr/bin/env ruby1.8

require 'rubygems'
require 'spreadsheet'
require 'config/environment'
Spreadsheet.client_encoding = 'UTF-8'

bill = Bill.last

book = Spreadsheet.open './lib/invoice_template.xls'
sheet = book.worksheets[0]


# Номер инвойса
sheet[0,4]+=bill.number.to_s
# Дата создания
sheet[1,4]+=bill.created_at.strftime("%d.%m.%Y")
# Номер договора
sheet[2,3]+= bill.client.contract_number.to_s + " от " + bill.client.contract_date.strftime("%d.%m.%Y")

# Реквизиты [4,5 : 17,5] 14 строк по 60 символов максимум
i=4; bill.client.payment_details.gsub(/(\t)/,'').split("\n").each do |v|
  sheet[i,5] = v; i+=1;
end

# Побежали по заявкам! Они начинаются с 24 строчки
i=0; bill.requests.each do |request, v|
  # Порядковый номер и наименование
  sheet[24+i, 0] = (bill.requests.index(request)+1).to_s+"." # Порядковый номер
  if request.load.id.eql?(1) # Если порожняк
    sheet[24+i, 1] = "Возврат порожнего вагона №"
    request.cars.each do |car|
      sheet[24+i, 1] += car.number
      sheet[24+i, 1] += "," unless car.eql?(request.cars.last)
    end
  else # Груз если груз
    sheet[24+i, 1] = "Груз - "+request.load_name 
  end
  
  i+=1;
  # Территории
  sheet[24+i,1] = "Территории "
  request.places.each do |place|
    sheet[24+i,1] += place.country_short_name
    sheet[24+i,1] += "," unless place.eql?(request.places.last)
  end
  i+=1;
  # Ставки за вагон
  sheet[24+i,1] = request.station_from_name + " - " + request.station_to_name # Наименование
  sheet[24+i,2] = request.rate_for_car ? request.cars_num : request.common_tonnage
  sheet[24+i,3] = request.rate_for_car ? "vag" : "MT"
  sheet[24+i,4] = request.cars.first.rate_client 
  sheet[24+i,5] = "=1+1"
  

end


book.write "./Invoice.xls"








