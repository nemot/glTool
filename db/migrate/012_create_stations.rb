class CreateStations < ActiveRecord::Migration
  def self.up
    create_table :stations do |t|
      t.integer :country_id,  :null=>false, :default=>0
      t.string :code,         :null=>false, :default=>"00000"
      t.string :name,         :null=>false, :default=>""
      t.string :short_name,   :null=>false, :default=>""
    end
  end

  def self.down
    drop_table :stations
  end
end
