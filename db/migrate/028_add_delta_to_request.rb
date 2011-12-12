class AddDeltaToRequest < ActiveRecord::Migration
  def self.up
    change_table :requests do |t|
      t.float  :delta,          :null=>false, :default=>0.00
    end
    
  end

  def self.down
    remove_column :delta, :profit
  end
end
