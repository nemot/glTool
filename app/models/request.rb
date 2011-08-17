class Request < ActiveRecord::Base
  
  belongs_to :station_from, :foreign_key=>"station_from_id", :class_name=>"Station"
  belongs_to :station_to,   :foreign_key=>"station_to_id",   :class_name=>"Station"
  belongs_to :client
  belongs_to :load
  belongs_to :car_type
  belongs_to :user
  
end
