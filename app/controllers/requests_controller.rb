class RequestsController < ApplicationController
  before_filter :require_user

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
    :created_user_id
  ]

  @@json_methods = [
    :client_name,
    :station_from_name,
    :station_to_name,
    :load_name,
    :car_type_name,
  ]

  def index
    cond = current_user.is_engineer? ? "client_id IN (#{current_user.client_ids})" : ""
    @requests = Request.all(:conditions=>cond)
    render :json=>{:success=>true, :requests=>@requests.as_json(:only=>@@json_params, :methods=>@@json_methods)}
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
    
    @request = Request.find_by_id(request["id"])
    @request.update_attributes!({
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
    })

    @request.cars.delete_all # Вместе с кодами
    @request.places.delete_all # В месте с допсборами и левыми кодами для уверености =)

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
    

  
    
    render :json=>{:success=>true}
  end

  private 

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
