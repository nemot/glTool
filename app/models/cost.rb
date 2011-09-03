class Cost < ActiveRecord::Base
  belongs_to :place
  
  def country_name
    self.place.nil? ? "" : self.place.country_name 
  end
end
