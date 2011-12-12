class DeltaPayment < ActiveRecord::Base
  
  def to_log
    "$#{sum.to_f.round(2)} #{created_at.strftime("%d.%m.%Y")}"
  end

end
