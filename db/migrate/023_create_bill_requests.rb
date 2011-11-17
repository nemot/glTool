class CreateBillRequests < ActiveRecord::Migration
  def self.up
    create_table :bill_requests do |t|
      t.integer :bill_id, :null=>false
      t.integer :request_id, :null=>false
      t.timestamps
    end
  end

  def self.down
    drop_table :bill_requests
  end
end
