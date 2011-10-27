# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 21) do

  create_table "car_types", :force => true do |t|
    t.string "name", :null => false
  end

  create_table "cars", :force => true do |t|
    t.integer "request_id",                      :null => false
    t.boolean "in_use",        :default => true
    t.string  "number",        :default => ""
    t.integer "tonnage",       :default => 0
    t.float   "weight",        :default => 0.0
    t.date    "shipping_date"
    t.string  "waybill",       :default => ""
    t.float   "rate_jd_real",  :default => 0.0,  :null => false
    t.float   "rate_jd",       :default => 0.0,  :null => false
    t.float   "rate_client",   :default => 0.0,  :null => false
  end

  create_table "client_users", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.integer  "client_id",  :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "clients", :force => true do |t|
    t.string   "name",                               :null => false
    t.string   "address",                            :null => false
    t.string   "phone",                              :null => false
    t.string   "email",                              :null => false
    t.string   "director",                           :null => false
    t.text     "payment_details",                    :null => false
    t.boolean  "is_expeditor",    :default => false
    t.float    "balance",         :default => 0.0,   :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "codes", :force => true do |t|
    t.integer "car_id",                        :null => false
    t.integer "place_id",                      :null => false
    t.string  "number",       :default => "",  :null => false
    t.float   "rate_jd_real", :default => 0.0
    t.float   "rate_jd",      :default => 0.0
    t.float   "rate_client",  :default => 0.0
  end

  create_table "costs", :force => true do |t|
    t.integer "place_id",                      :null => false
    t.string  "name",         :default => ""
    t.float   "rate_jd",      :default => 0.0
    t.float   "rate_client",  :default => 0.0
    t.integer "payment_type", :default => 0
  end

  create_table "countries", :force => true do |t|
    t.string "name",       :default => "", :null => false
    t.string "short_name", :default => "", :null => false
  end

  create_table "documents", :force => true do |t|
    t.integer  "request_id",                              :null => false
    t.date     "date_of_issue", :default => '2011-10-27', :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "loads", :force => true do |t|
    t.string "name"
    t.string "gng"
    t.string "etsng"
  end

  create_table "places", :force => true do |t|
    t.integer "request_id", :null => false
    t.integer "country_id", :null => false
    t.integer "exp_id",     :null => false
  end

  create_table "requests", :force => true do |t|
    t.integer  "client_id",                                                  :null => false
    t.integer  "station_from_id",                                            :null => false
    t.integer  "station_to_id",                                              :null => false
    t.integer  "load_id",                :default => 1,                      :null => false
    t.date     "date_of_issue",          :default => '2011-10-27',           :null => false
    t.date     "valid_until",            :default => '2011-10-31',           :null => false
    t.string   "type_of_transportation", :default => "Повагонная", :null => false
    t.string   "ownership",              :default => "СПС",               :null => false
    t.integer  "car_type_id",                                                :null => false
    t.string   "sender",                 :default => "",                     :null => false
    t.string   "receiver",               :default => "",                     :null => false
    t.string   "gu12",                   :default => "",                     :null => false
    t.boolean  "rate_for_car",           :default => true,                   :null => false
    t.float    "client_sum",             :default => 0.0,                    :null => false
    t.float    "jd_sum",                 :default => 0.0,                    :null => false
    t.integer  "cars_num",               :default => 0,                      :null => false
    t.integer  "common_tonnage",         :default => 0,                      :null => false
    t.integer  "created_user_id",                                            :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stations", :force => true do |t|
    t.integer "country_id", :default => 0,       :null => false
    t.string  "code",       :default => "00000", :null => false
    t.string  "name",       :default => "",      :null => false
    t.string  "short_name", :default => "",      :null => false
  end

  create_table "transactions", :force => true do |t|
    t.float    "value",            :default => 0.0,                   :null => false
    t.string   "description",                                         :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "client_id",        :default => 1
    t.datetime "date_of_transfer", :default => '2011-10-27 09:45:48'
  end

  create_table "transit_stations", :force => true do |t|
    t.integer  "request_id"
    t.integer  "station_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_actions", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.string   "action",     :null => false
    t.string   "entity",     :null => false
    t.text     "raw_data",   :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_sessions", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "login",                              :null => false
    t.string   "email",                              :null => false
    t.string   "fio",                :default => "", :null => false
    t.string   "position",           :default => "", :null => false
    t.string   "crypted_password",                   :null => false
    t.string   "password_salt",                      :null => false
    t.string   "persistence_token",                  :null => false
    t.integer  "login_count",        :default => 0,  :null => false
    t.integer  "failed_login_count", :default => 0,  :null => false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "role_id",            :default => 1
  end

end
