class CreateUserActions < ActiveRecord::Migration
  def self.up
    create_table :user_actions do |t|
      t.integer :user_id,   :null=>false
      t.string  :action,    :null=>false
      t.string  :entity,    :null=>false
      t.text    :raw_data,  :null=>false
      t.timestamps
    end
  end

  def self.down
    drop_table :user_actions
  end
end
