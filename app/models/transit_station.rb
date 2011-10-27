class TransitStation < ActiveRecord::Base
  belongs_to :request
  belongs_to :station

  def station_name
    self.station.nil? ? "" : self.station.name 
  end
end
