class Bill < ActiveRecord::Base
  belongs_to :user, :foreign_key=>"created_user_id", :class_name=>"User"
  belongs_to :client
  has_many :bill_requests
  has_many :requests, :through=>:bill_requests


  def client_name
    self.client.nil? ? "" : self.client.name
  end
  
  def created_user_name
    self.user.nil? ? "" : self.user.login
  end  


end
