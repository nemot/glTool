class CreateTransactions < ActiveRecord::Migration
  def self.up
    create_table :transactions do |t|
      t.float :value, :null=>false, :default=>0.to_f
      t.string :description, :null=>false
      t.timestamps
    end
  end

  def self.down
    drop_table :transactions
  end
end
