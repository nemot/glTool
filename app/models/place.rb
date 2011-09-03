class Place < ActiveRecord::Base
  has_many :codes
  has_many :costs
  belongs_to :country
  belongs_to :expeditor, :class_name=>"Client", :foreign_key=>'exp_id'


  def country_name
    self.country.nil? ? "" : self.country.name 
  end

  def expeditor_name
    self.expeditor.nil? ? "" : self.expeditor.name 
  end

end
