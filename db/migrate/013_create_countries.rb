class CreateCountries < ActiveRecord::Migration
  def self.up
    create_table :countries do |t|
      t.string :name, :null=>false, :default=>""
      t.string :short_name, :null=>false, :default=>""
    end
  end

  def self.down
    drop_table :countries
  end
end
