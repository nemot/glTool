class Place < ActiveRecord::Base
  has_many :codes, :dependent => :destroy
  has_many :costs, :dependent => :destroy
  belongs_to :country
  belongs_to :expeditor, :class_name=>"Client", :foreign_key=>'exp_id'
  belongs_to :request


  def country_short_name
    self.country.nil? ? "" : (self.country.short_name.to_s.empty? ? self.country.name : self.country.short_name)
  end

  def country_name
    self.country.nil? ? "" : self.country.name 
  end

  def expeditor_name
    self.expeditor.nil? ? "" : self.expeditor.name 
  end

end
