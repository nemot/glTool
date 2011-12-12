class CreateCars < ActiveRecord::Migration
  def self.up
    create_table :cars do |t|
      t.integer :request_id, :null=>false
      t.boolean :in_use,  :default=>true
      t.string  :number,  :default=>""
      t.integer :tonnage, :default=>0
      t.float   :weight,  :default=>0.0
      t.date    :shipping_date, :null=>true
      t.string  :waybill, :default=>""
      t.float   :rate_jd_real, :null=>false, :default=>0.0
      t.float   :rate_jd,      :null=>false, :default=>0.0
      t.float   :rate_client,  :null=>false, :default=>0.0
    end

    add_index :cars, :request_id
    add_index :cars, :number
    
  end

  def self.down
    drop_table :cars
  end
end
