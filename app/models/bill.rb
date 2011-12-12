class Bill < ActiveRecord::Base
  belongs_to :user, :foreign_key=>"created_user_id", :class_name=>"User"
  belongs_to :client
  has_many :bill_requests
  has_many :requests, :through=>:bill_requests


  def log_string
    "#{self.client_name} #{self.number}"
  end  

  def requests_count
    self.requests.length
  end

  def self.next_number
    max_num = Bill.maximum('number')
    return max_num ? max_num.gsub(/(\d+)$/, (max_num.match(/(\d+)$/)[0].to_i+1).to_s) : ""
  end

  def client_name
    self.client.nil? ? "" : self.client.name
  end
  
  def created_user_name
    self.user.nil? ? "" : self.user.login
  end

  def before_save
    self.backwash = (self.summ - self.requests.sum('client_sum').to_f.round(2)).to_f.round(2)
  end


end
