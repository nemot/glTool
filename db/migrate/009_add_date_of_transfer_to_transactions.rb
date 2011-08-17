class AddDateOfTransferToTransactions < ActiveRecord::Migration
  def self.up
    change_table :transactions do |t|
      t.datetime :date_of_transfer, :default=>Time.now
    end
  end

  def self.down
    remove_column :transactions, :date_of_transfer
  end
end
