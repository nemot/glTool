#!/usr/bin/env ruby1.8
# -*- coding:utf-8 -*-
require 'rubygems'

require 'net/http'

last_page = 20429

h = Net::HTTP.new("cargo.rzd.ru", 80)
h.read_timeout = 500
bad_files = 0;
(1..last_page).each{|i|
#    printf "#{i}   "
    begin
      
      resp = h.get("/isvp/public/cargo?STRUCTURE_ID=5101&layer_id=4829&page4821_2705=1024&refererLayerId=4821&id=#{i}",nil)
      station_code = resp.read_body.match(/(Полное наименование станции\n\t\t\t<\/th><td>)(.*?)(<\/td>)/u)[2]
      railway_name = resp.read_body.match(/(Наименование ЖД\n\t\t\t<\/th><td>)(.*?)(<\/td>)/u)[2]
#      printf "#{station_code};#{railway_name}\n"
      f = File.open('nf.txt','a')
      f << i.to_s
      f << ';'
      f << station_code.strip
      f << ";"
      f << railway_name
      f << "\n"
      f.close
    rescue
      bad_files+=1;
#      printf "---------------------------------------------------------------------\n"
    end

}
f = File.open('nf.txt','a')
f << bad_files.to_s
f.close

#puts "DONE!"
