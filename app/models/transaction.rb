class Transaction < ActiveRecord::Base
  belongs_to :client


  def name_for_user_log
    "#{self.client.name} на $#{self.value}"
  end
end
