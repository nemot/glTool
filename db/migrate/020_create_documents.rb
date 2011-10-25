class CreateDocuments < ActiveRecord::Migration
  def self.up
    create_table :documents do |t|
      t.integer  :request_id, :null=>false
      t.date     :date_of_issue,   :null=>false, :default=>Date.today

      t.timestamps
    end
  end

  def self.down
    drop_table :documents
  end
end
