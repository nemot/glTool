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
    end
  end

  def self.down
    drop_table :cars
  end
end
