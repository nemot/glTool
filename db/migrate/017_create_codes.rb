class CreateCodes < ActiveRecord::Migration
  def self.up
    create_table :codes do |t|
      t.integer :car_id,      :null=>false
      t.integer :place_id,    :null=>false
      t.string  :number,      :default=>"", :null=>false
      t.float   :rate_jd_real,:default=>0.0
      t.float   :rate_jd,     :default=>0.0
      t.float   :rate_client, :default=>0.0
    end
    add_index :codes, :number
  end

  def self.down
    drop_table :codes
  end
end
