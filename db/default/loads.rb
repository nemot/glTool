config   = Rails.configuration.database_configuration
host     = config[Rails.env]["host"]
database = config[Rails.env]["database"]
username = config[Rails.env]["username"]
password = config[Rails.env]["password"]


a = %x[mysql "-u#{config[Rails.env]['username']}" "-p#{config[Rails.env]['password']}" "#{config[Rails.env]['database']}" < ./db/default/loads.sql]
puts a
