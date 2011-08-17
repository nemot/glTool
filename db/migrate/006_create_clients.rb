class CreateClients < ActiveRecord::Migration
  def self.up
    create_table :clients do |t|
      t.string  :name, :null=>false
      t.string  :address, :null=>false
      t.string  :phone, :null=>false
      t.string  :email, :null=>false
      t.string  :director, :null=>false
      t.text    :payment_details, :null=>false
      t.boolean :is_expeditor, :default=>false
      t.float   :balance, :default=>0, :null=>false
      t.timestamps
    end
  end

  def self.down
    drop_table :clients
  end
end
