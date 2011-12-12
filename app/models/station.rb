class Station < ActiveRecord::Base
  belongs_to :country
  belongs_to :railway
end
