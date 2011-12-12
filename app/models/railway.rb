class Railway < ActiveRecord::Base
  belongs_to :country
  has_many :stations
end
