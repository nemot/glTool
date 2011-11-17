#!/usr/bin/env ruby1.8
require 'rubygems'
require 'rjb'
require 'config/environment'


bill = Bill.last


# Importing all we need
def import_all
  Rjb::load("./lib/jxl.jar", ['-Xms512M', '-Xmx1024M'])
  @file_class = Rjb::import('java.io.File')
  @workbook_class = Rjb::import('jxl.Workbook')
  @number_class = Rjb::import('jxl.write.Number')
  @image_class = Rjb::import('jxl.write.WritableImage')
  @label_class = Rjb::import('jxl.write.Label')
  @format_class = Rjb::import('jxl.write.WritableCellFormat')
  @color_class = Rjb::import('jxl.format.Colour')
  @border_class = Rjb::import('jxl.format.Border')
  @lineStyle_class = Rjb::import('jxl.format.BorderLineStyle')
  @alignment_class = Rjb::import('jxl.format.Alignment')
  @font_class = Rjb::import('jxl.write.WritableFont')
  @underlineStyle_class = Rjb::import('jxl.format.UnderlineStyle')
  @cellview_class = Rjb::import('jxl.CellView')
end
# Do it!
import_all



# Creating book
book = @workbook_class.createWorkbook(@file_class.new("test.xls"))
sheet = book.createSheet("Первый лист", 0)

# Making font styles
default_font = @font_class.new(@font_class.TAHOMA);
default_font.setPointSize(10)

default_medium_font = @font_class.new(@font_class.TAHOMA);
default_medium_font.setPointSize(11)

bold_font = @font_class.new(@font_class.TAHOMA)
bold_font.setPointSize(10)
bold_font.setBoldStyle(@font_class.BOLD)

header_bold_font = @font_class.new(@font_class.TAHOMA)
header_bold_font.setPointSize(14)
header_bold_font.setBoldStyle(@font_class.BOLD)

# Номер инвойса
header_bold_format = @format_class.new(header_bold_font)
header_bold_format.setAlignment(@alignment_class.CENTRE)
sheet.addCell(@label_class.new(4, 0, "Invoice № #{bill.number}", header_bold_format)) 

# Дата инвойса
header_medium_format = @format_class.new(default_medium_font)
header_medium_format.setAlignment(@alignment_class.CENTRE)
sheet.addCell(@label_class.new(4, 1, "Dated  #{bill.created_at.strftime("%d.%m.%Y")}", header_medium_format))


book.write
book.close
