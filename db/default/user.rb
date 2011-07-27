# see last line where we create an admin if there is none, asking for email and password
def prompt_for_admin_password
  password = ask('Password [admin_password]: ', String) do |q|
    q.echo = false
    q.validate = /^(|.{5,40})$/
    q.responses[:not_valid] = "Invalid password. Must be at least 5 characters long."
    q.whitespace = :strip
  end
  password = "admin_password" if password.blank?
  password
end

def prompt_for_admin_email
  email = ask('Email [admin@greenline-trans.co.uk]: ', String) do |q|
    q.echo = true
    q.whitespace = :strip
  end
  email = "admin@greenline-trans.co.uk" if email.blank?
  email
end


def create_admin_user
  if ENV['AUTO_ACCEPT']
    password =  "admin_password"
    email =  "admin@greenline-trans.co.uk"
  else
    require 'highline/import'
    puts "Create the admin user (press enter for defaults)."
    email = prompt_for_admin_email
    password = prompt_for_admin_password
  end
  attributes = {
    :password => password,
    :password_confirmation => password,
    :position=> 'Администратор системы',
    :fio=>"Не важно",
    :email => email,
    :login => 'admin'
  }

  load 'user.rb'

  if User.find_by_login("admin")
    say "\nWARNING: There is already a user with the login: admin, so no account changes were made.  If you wish to create an additional admin user, please run rake db:admin:create again with a different email.\n\n"
  else
    admin = User.new(attributes)
    admin.save!
#    # create an admin role and and assign the admin user to that role
#    role = Role.find_or_create_by_name "admin"
#    admin.roles << role
#    admin.save!
#    admin.confirm!
#    say admin.errors.empty? ? "\nAdmin user succesfuly created." : admin.errors.inspect
  end
end

create_admin_user #if User.where("roles.name" => 'admin').includes(:roles).empty?
