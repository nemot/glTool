class Client < ActiveRecord::Base
  has_many :transactions 
  has_many :client_users, :dependent=>:destroy
  has_many :users, :through=>:client_users
  has_many :bills, :dependent => :destroy

  has_many :requests, :dependent=>:destroy



  # Небольшая защита от несанкционированого чтения баланса клиента инжинером
  def balance
    if UserInfo.current_user.is_engineer?
      self.users.exists?(UserInfo.current_user) ? self.attributes["balance"] : 0
    else
      self.attributes["balance"]
    end
  end
  
  # Массив id заявок, где он экспедитор
  def expeditor_in_requests(user)
    conds = "exp_id=#{self.id} "
    conds << "AND request_id IN (
          SELECT requests.id FROM requests 
          LEFT JOIN client_users ON requests.client_id=client_users.client_id
          WHERE client_users.user_id=#{user.id}
        )" if user.is_engineer?
    Place.all(
      :conditions => conds,
      :limit => 10
    ).map{|p| p.request_id }.uniq
  end
  
  # Массив id заявок, где он экспедитор
  def expeditor_in_unavailable_requests?(user)
    return false unless user.is_engineer?
    !Place.all(
      :conditions => "
        exp_id=#{self.id} AND 
        request_id NOT IN (
          SELECT requests.id FROM requests 
          LEFT JOIN client_users ON requests.client_id=client_users.client_id
          WHERE client_users.user_id=#{user.id}
        )
      ",
      :limit => 1
    ).empty?
  end

end
