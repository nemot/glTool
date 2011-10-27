class CreateTransitStations < ActiveRecord::Migration
  def self.up
    create_table :transit_stations do |t|
      t.integer :request_id
      t.integer :station_id
      t.timestamps
    end
  end

  def self.down
    drop_table :transit_stations
  end
end
