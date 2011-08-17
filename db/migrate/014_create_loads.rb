class CreateLoads < ActiveRecord::Migration
  def self.up
    create_table :loads do |t|
      t.string :name	
      t.string :gng	
      t.string :etsng
    end
  end

  def self.down
    drop_table :loads
  end
end
