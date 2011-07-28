class User < ActiveRecord::Base
  acts_as_authentic
  validates :login, :email, :presence => true
  validates :login, :uniqueness => true

  belongs_to :role
  has_many :actions, :class_name=>"UserAction"


  # Returns: 1 if currently online; last_request_at if currently ofline; nil if never logged in
  def was_online
    self.logged_in? ? 1 : self.last_login_at
  end

  def log action, entity="", raw_data=""
    self.actions.create({:action=>action, :entity=>entity, :raw_data=>raw_data})
  end


end
