class CreateCarTypes < ActiveRecord::Migration
  def self.up
    create_table :car_types do |t|
      t.string :name, :null=>false
    end
  end

  def self.down
    drop_table :car_types
  end
end
