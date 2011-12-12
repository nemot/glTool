class Request < ActiveRecord::Base
  
  belongs_to :station_from, :foreign_key=>"station_from_id", :class_name=>"Station"
  belongs_to :station_to,   :foreign_key=>"station_to_id",   :class_name=>"Station"
  belongs_to :client
  belongs_to :load
  belongs_to :car_type
  belongs_to :user

  has_many :cars, :order=>"id DESC", :dependent => :destroy
  has_many :places, :dependent => :destroy
  has_many :transit_stations, :dependent => :destroy
  has_many :costs, :through=>:places
  has_many :documents, :dependent => :destroy

  has_one :bill_request
  has_one :bill, :through=>:bill_request  

  
  def finances
    result = {:client=>0, :expeditors=>{}, :delta=>0, :profit=>0}
    # Бегаем по вагонам
    self.cars.each do |car|
      if car.in_use
        # Считаем доход
        profit = (self.load_id.eql?(1) ? car.rate_client-car.rate_jd : car.rate_jd-car.rate_jd_real).to_f.round(2)
        profit = profit*car.tonnage unless rate_for_car 
        result[:profit] += profit
        # Считаем дельту
        delta = (self.load_id.eql?(1) ? car.rate_jd-car.rate_jd_real : car.rate_client-car.rate_jd).to_f.round(2)
        delta = delta*car.tonnage unless rate_for_car
        result[:delta] += delta
        # Добавляем счет клиенту
        result[:client] += (rate_for_car ? car.rate_client : car.rate_client*car.tonnage).to_f.round(2)  
      end
    end
    # Побежали по плейсам
    self.places.each do |place|
      exp = place.expeditor
      # Добавляем экспедитора к суммам
      result[:expeditors].merge!({exp.id=>0.00})
      # Коды
      place.codes.each do |code|
        if code.car.in_use
          # Добавляем расход к экспедитору
          result[:expeditors][exp.id] += (place.request.rate_for_car ? code.rate_jd_real  : code.rate_jd_real*code.car.tonnage).to_f.round(2)
        end
      end
      # Разовые доп сборы
      e = place.costs.select{|c| c.payment_type.eql?(0)}.sum(&:rate_jd).to_f.round(2)
      c = place.costs.select{|c| c.payment_type.eql?(0)}.sum(&:rate_client).to_f.round(2)
      result[:expeditors][exp.id] += e; result[:client]+= c; result[:profit]+= (c-e).to_f.round(2)
      # Доп сборы за вагон
      e = (place.costs.select{|c| c.payment_type.eql?(1)}.sum(&:rate_jd)*place.request.cars_num).to_f.round(2);
      c = (place.costs.select{|c| c.payment_type.eql?(1)}.sum(&:rate_client)*place.request.cars_num).to_f.round(2)
      result[:expeditors][exp.id] += e; result[:client]+= c; result[:profit]+= (c-e).to_f.round(2) 
      # Доп сборы за тонну
      e = (place.costs.select{|c| c.payment_type.eql?(2)}.sum(&:rate_jd)*place.request.common_tonnage).to_f.round(2)
      c = (place.costs.select{|c| c.payment_type.eql?(2)}.sum(&:rate_client)*place.request.common_tonnage).to_f.round(2)
      result[:expeditors][exp.id] += e; result[:client]+= c; result[:profit]+= (c-e).to_f.round(2)

    end
    return result
  end


  def update_profit_and_delta
    self.update_attribute(:profit, finances[:profit])
    self.update_attribute(:delta, finances[:delta])
  end

  def increase_expeditor_balance
    self.places.each do |place|
      place.expeditor.balance_expeditor += finances[:expeditors][place.expeditor.id]
      place.expeditor.save!
    end
  end

  def decrease_expeditor_balance
    self.places.each do |place|
      # Выдергиваем экспедитора
      place.expeditor.balance_expeditor -= finances[:expeditors][place.expeditor.id]
      place.expeditor.save!
    end
  end

  def increase_client_balance
    client.balance_client += finances[:client]; client.save!
  end

  def decrease_client_balance
    client.balance_client -= finances[:client]; client.save!
  end

  def increase_delta
    client.delta += finances[:delta]; client.save!
  end

  def decrease_delta
    client.delta -= finances[:delta]; client.save!
  end  

  def log_string
    "№#{self.id} (#{self.cars_num} ваг. #{self.common_tonnage} тн. #{self.station_from_name}-#{self.station_to_name})"
  end

  def client_name
    self.client.nil? ? "" : self.client.name
  end

  def station_from_name
    self.station_from.nil? ? "" : self.station_from.name 
  end

  def station_to_name
    self.station_to.nil? ? "" : self.station_to.name 
  end

  def load_name
    self.load.nil? ? "" : self.load.name
  end

  def car_type_name
    self.car_type.nil? ? "" : self.car_type.name
  end
end
