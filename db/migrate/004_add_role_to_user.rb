class AddRoleToUser < ActiveRecord::Migration
  def self.up
    change_table :users do |t|
      t.integer :role_id, :default=>1
    end
  end

  def self.down
    remove_column :users, :role_id
  end
end
