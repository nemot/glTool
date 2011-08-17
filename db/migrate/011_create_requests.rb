class CreateRequests < ActiveRecord::Migration
  def self.up
    create_table :requests do |t|
      # Поля заявки
      t.integer  :client_id,       :null=>false
      t.integer  :station_from_id, :null=>false
      t.integer  :station_to_id,   :null=>false
      t.integer  :load_id,         :null=>false
      t.date     :date_of_issue,   :null=>false, :default=>Date.today
      t.date     :valid_until,     :null=>false, :default=>Date.new(Date.today.year, Date.today.month, -1) # Last day of current month
      t.string   :type_of_transportation, :null=>false, :default=>""
      t.string   :ownership,       :null=>false, :default=>"МПС"
      t.integer  :car_type_id,     :null=>false
      t.string   :sender,          :null=>false, :default=>""
      t.string   :receiver,        :null=>false, :default=>""
      t.string   :gu12,            :null=>false, :default=>""
      t.boolean  :rate_for_car,    :null=>false, :default=>true
      # Поля для калькуляции
      t.float    :client_sum,      :null=>false, :default=>0.00
      t.float    :jd_sum,          :null=>false, :default=>0.00
      t.integer  :cars_num,        :null=>false, :default=>0
      t.integer  :common_tonnage,  :null=>false, :default=>0
      # Ну и создавший пользователь
      t.integer  :created_user_id,  :null=>false
      t.timestamps
    end
  end

  def self.down
    drop_table :requests
  end
end
