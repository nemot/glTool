class CreatePlaces < ActiveRecord::Migration
  def self.up
    create_table :places do |t|
      t.integer :request_id, :null=>false
      t.integer :country_id, :null=>false
      t.integer :exp_id,     :null=>false
    end
  end

  def self.down
    drop_table :places
  end
end
