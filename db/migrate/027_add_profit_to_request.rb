class AddProfitToRequest < ActiveRecord::Migration
  def self.up
    change_table :requests do |t|
      t.float  :profit,          :null=>false, :default=>0.00
    end
    
  end

  def self.down
    remove_column :requests, :profit
  end
end
