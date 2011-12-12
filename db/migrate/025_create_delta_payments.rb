class CreateDeltaPayments < ActiveRecord::Migration
  def self.up
    create_table :delta_payments do |t|
      t.float  :sum, :default=>0.00, :null => false
      t.string :note, :null=>false, :default=>""
      t.timestamps
    end
  end

  def self.down
    drop_table :delta_payments
  end
end
