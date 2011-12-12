class AddDateColumnToDeltaPayments < ActiveRecord::Migration
  def self.up
    change_table :delta_payments do |t|
      t.datetime :date_of_transfer, :default=>Time.now
    end
  end

  def self.down
    remove_column :delta_payments, :date_of_transfer
  end
end
