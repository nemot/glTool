class RequestsController < ApplicationController
  before_filter :require_user, :set_current_user

  @@json_params = [
    :id,
    :client_id,
    :station_from_id,
    :station_to_id,
    :load_id,
    :date_of_issue,
    :valid_until,
    :type_of_transportation,
    :ownership,
    :car_type_id,
    :sender,
    :receiver,
    :gu12,
    :rate_for_car,
    :client_sum,
    :jd_sum,
    :cars_num,
    :common_tonnage,
    :created_user_id,
    :has_invoice,
    :payed
  ]

  @@json_methods = [
    :client_name,
    :station_from_name,
    :station_to_name,
    :load_name,
    :car_type_name,
  ]

  def index
    @requests = Request.all(
      :conditions=>make_find_conditions,
      :order=>"date_of_issue DESC", 
      :offset=>params[:start].to_i,
      :limit=>params[:limit].to_i
    )
    count = Request.count(:conditions=>make_find_conditions)
    render :json=>{:success=>true, :requests=>@requests.as_json(:only=>@@json_params, :methods=>@@json_methods), 
      :total=>count }
  end

  def new
    @request = Request.new
    @countries = Country.all
    @car_types = CarType.all
    render :layout=>'request'
  end


  def show
    @request = Request.find(params[:id])
    @countries = Country.all
    @car_types = CarType.all
    render :layout=>'request'
  end

  def create
    request = parse_json_params(:request)
    cars = parse_json_params(:cars)
    places = parse_json_params(:places)
    costs = parse_json_params(:costs)
    transit_stations = parse_json_params(:transit_stations)
    
    @request = Request.find_by_id(request["id"])
    
    request_attributes = {
      :client_id => request["client_id"],
      :station_from_id => request["station_from_id"],
      :station_to_id => request["station_to_id"],
      :load_id => request["load_id"],
      :date_of_issue => request["date_of_issue"],
      :valid_until => request["valid_until"],
      :type_of_transportation => request["type_of_transportation"],
      :ownership => request["ownership"],
      :car_type_id => request["car_type_id"],
      :sender => request["sender"],
      :receiver => request["receiver"],
      :gu12 => request["gu12"],
      :rate_for_car => request["rate_for_car"],
      :client_sum => request["client_sum"],
      :jd_sum => request["jd_sum"],
      :cars_num => request["cars_num"],
      :common_tonnage => request["common_tonnage"]
    }
    if @request.nil?
      @request = Request.create(request_attributes.merge!({:created_user_id=>current_user.id}))
      current_user.log('request.create', @request.log_string, @request.to_json)
    else
      @request.update_attributes!(request_attributes)
      current_user.log('request.update', @request.log_string, @request.to_json)
    end
    

    @request.cars.delete_all # Вместе с кодами
    @request.places.delete_all # В месте с допсборами и левыми кодами для уверености =)
    @request.transit_stations.delete_all # Транзитные станции

    cars.each{|car|
      @car = Car.create({
        :request_id => @request.id,
        :in_use => car["in_use"],
        :number => car["number"],
        :tonnage => car["tonnage"],
        :weight => car["weight"],
        :shipping_date => car["shipping_date"],
        :waybill => car["waybill"],
        :rate_jd_real => car["rate_jd_real"],
        :rate_jd => car["rate_jd"],
        :rate_client => car["rate_client"],
      })
      car["codes"].each{ |code|
        Code.create({
          :car_id => @car.id,
          :place_id => code["place_id"],
          :number => code["number"],
          :rate_jd_real => code["rate_jd_real"],
          :rate_jd => code["rate_jd"],
          :rate_client => code["rate_client"],
        })
      }
    }
   
    places.each{|place| 
      @place = Place.create({
        :request_id => @request.id,
        :country_id => place["country_id"],
        :exp_id => place["exp_id"]
      })
      Code.where("place_id=?", place["id"]).update_all(:place_id=>@place.id)
      costs.select{|c| c["place_id"].eql?(place["id"])}.each{|cost|
        Cost.create({
          :place_id => @place.id,
          :name => cost["name"],
          :rate_jd => cost["rate_jd"],
          :rate_client => cost["rate_client"],
          :payment_type => cost["payment_type"]
        })
      }
    }
    
    transit_stations.each{|ts|
      TransitStation.create({
        :request_id => @request.id,
        :station_id => ts["station_id"]
      })
    }

  
    
    render :json=>{:success=>true}
  end

  def destroy
    @request = Request.find_by_id(params[:id])
    current_user.log('request.remove', @request.log_string, @request.to_json)
    deleted_records = Request.destroy(params[:id])
    @requests = Request.all(
      :conditions=>make_find_conditions,
      :order=>"date_of_issue DESC", 
      :offset=>params[:start].to_i,
      :limit=>params[:limit].to_i
    )
    count = Request.count(:conditions=>make_find_conditions)
    render :json=>{
      :success=>deleted_records.length.eql?(1),
      :requests=>@requests.as_json(:only=>@@json_params, :methods=>@@json_methods), 
      :total=>count 
    }
  end

  private 

  def make_find_conditions
    cond = "1=1 "
    cond << "AND client_id IN (#{current_user.client_ids}) " if current_user.is_engineer?
    cond << "AND load_id=1 " if params[:loadless].eql?('true')
    cond << "AND client_id=#{params[:outbox_client_id]} AND has_invoice=false " if params[:outbox_client_id]
    params[:query] = "" if params[:query].nil?
    unless params[:query].empty?
      cond << "AND id IN( SELECT DISTINCT cars.request_id  FROM cars
        LEFT JOIN codes ON codes.car_id=cars.id 
        WHERE codes.number LIKE '%#{params[:query]}%' )" if params[:find_param].eql?('code')
      cond << "AND id IN( SELECT DISTINCT cars.request_id  FROM cars
        WHERE cars.number LIKE '%#{params[:query]}%' )" if params[:find_param].eql?('car')
      cond << "AND requests.id='#{params[:query]}'" if params[:find_param].eql?('request')
      cond << "AND requests.client_id IN( SELECT DISTINCT clients.id FROM clients
        WHERE clients.name LIKE '%#{params[:query]}%' )" if params[:find_param].eql?('client')
    end

    return cond
  end

  def parse_json_params(pname)
    result = []
    v = ActiveSupport::JSON.decode(params[pname])
    unless v.class.to_s.eql?("Array")
      result = v 
    else
      v.each{|c| result << ActiveSupport::JSON.decode(c) }
    end
    result
  end

end
