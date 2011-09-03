class Request < ActiveRecord::Base
  
  belongs_to :station_from, :foreign_key=>"station_from_id", :class_name=>"Station"
  belongs_to :station_to,   :foreign_key=>"station_to_id",   :class_name=>"Station"
  belongs_to :client
  belongs_to :load
  belongs_to :car_type
  belongs_to :user
  has_many :cars
  has_many :places
  has_many :costs, :through=>:places


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
