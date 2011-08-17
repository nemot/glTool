class CarType < ActiveRecord::Base
  has_many :requests
end
