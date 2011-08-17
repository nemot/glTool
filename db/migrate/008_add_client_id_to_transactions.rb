class AddClientIdToTransactions < ActiveRecord::Migration
  def self.up
    change_table :transactions do |t|
      t.integer :client_id, :default=>1
    end
  end

  def self.down
    remove_column :transactions, :client_id
  end
end
