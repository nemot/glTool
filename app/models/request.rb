class Request < ActiveRecord::Base
  
  belongs_to :station_from, :foreign_key=>"station_from_id", :class_name=>"Station"
  belongs_to :station_to,   :foreign_key=>"station_to_id",   :class_name=>"Station"
  belongs_to :client
  belongs_to :load
  belongs_to :car_type
  belongs_to :user
  has_many :cars, :order=>"id DESC", :dependent => :destroy
  has_many :places, :dependent => :destroy
  has_many :transit_stations, :dependent => :destroy
  has_many :costs, :through=>:places
  has_many :documents, :dependent => :destroy

  has_one :bill_request
  has_one :bill, :through=>:bill_request

  def log_string
    "№#{self.id} (#{self.cars_num} ваг. #{self.common_tonnage} тн. #{self.station_from_name}-#{self.station_to_name})"
  end

  def client_name
    self.client.nil? ? "" : self.client.name
  end

  def station_from_name
    self.station_from.nil? ? "" : self.station_from.name 
  end

  def station_to_name
    self.station_to.nil? ? "" : self.station_to.name 
  end    

  def load_name
    self.load.nil? ? "" : self.load.name
  end

  def car_type_name
    self.car_type.nil? ? "" : self.car_type.name
  end
end
