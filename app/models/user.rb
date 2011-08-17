class User < ActiveRecord::Base
  acts_as_authentic
  validates :login, :email, :presence => true
  validates :login, :uniqueness => true

  belongs_to :role
  has_many :client_users
  has_many :clients, :through=>:client_users
  has_many :actions, :class_name=>"UserAction"
  has_many :requests


  def is_engineer?
    self.role_id.eql?(4)
  end

  # Returns: 1 if currently online; last_request_at if currently ofline; nil if never logged in
  def was_online
    self.logged_in? ? 1 : self.last_login_at
  end

  def role_name
    self.role.name
  end


  attr_accessor :client_id
  def has_access_to_client? id=nil
    id ||= client_id
    self.role_id.eql?(4) ? self.clients.exists?(id) : true
  end


#  Устанавливает доступ к клиенту
  def set_access_to_client client_id=nil, value=true
    if self.role_id.eql?(4) and !client_id.nil? # Только если инженер и client_id не nil
      client = Client.find_by_id(client_id)
      value ? (self.clients << client) : self.clients.delete(client) unless client.nil?
    end
  end

  def log action, entity="", raw_data=""
    self.actions.create({:action=>action, :entity=>entity, :raw_data=>raw_data})
  end



end
