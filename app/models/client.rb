class Client < ActiveRecord::Base
  has_many :transactions 
  has_many :client_users
  has_many :users, :through=>:client_users

  has_many :requests



  # Небольшая защита от несанкционированого чтения баланса клиента инжинером
  def balance
    if UserInfo.current_user.is_engineer?
      self.users.exists?(UserInfo.current_user) ? self.attributes["balance"] : 0
    else
      self.attributes["balance"]
    end
  end
end
