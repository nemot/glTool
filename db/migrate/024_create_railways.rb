class CreateRailways < ActiveRecord::Migration
  def self.up
    create_table :railways do |t|
      t.integer :country_id, :null=>false, :default=>0
      t.string :code, :null=>false, :default=>""
      t.string :name, :null=>false, :default=>""
      t.string :short_name, :null=>false, :default=>""
    end
  end

  def self.down
    drop_table :railways
  end
end
