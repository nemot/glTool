class BillRequest < ActiveRecord::Base
  belongs_to :request
  belongs_to :bill
end
