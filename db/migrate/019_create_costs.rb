class CreateCosts < ActiveRecord::Migration
  def self.up
    create_table :costs do |t|
      t.integer :place_id,    :null=>false
      t.string  :name,        :default=>""
      t.float   :rate_jd,     :default =>0.0
      t.float   :rate_client, :default =>0.0
      t.integer :payment_type,:default=>0 #0-Разовый, 1-За вагон, 2-За тонну
    end
  end

  def self.down
    drop_table :costs
  end
end
