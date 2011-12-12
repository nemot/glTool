class CreateBills < ActiveRecord::Migration
  def self.up
    create_table :bills do |t|
      t.integer  :client_id, :null=>false
      t.integer  :created_user_id, :null=>false
      t.boolean  :inbox, :default=>false
      

      t.string   :number, :null=>false, :default => ""
      t.float    :summ, :null=>false, :default => 0.00
      
      t.float    :backwash, :null=>true

      t.boolean  :sent,    :default => false
      t.datetime :sent_at, :null=>true

      t.boolean  :payed,    :default => false
      t.datetime :payed_at, :null=>true
      
      t.timestamps
    end
  end

  def self.down
    drop_table :bills
  end
end
