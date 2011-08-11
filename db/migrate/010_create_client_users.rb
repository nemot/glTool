class CreateClientUsers < ActiveRecord::Migration
  def self.up
    create_table :client_users do |t|
      t.integer :user_id,       :null=>false
      t.integer :client_id,  :null=>false
      t.timestamps
    end
  end

  def self.down
    drop_table :client_users
  end
end
