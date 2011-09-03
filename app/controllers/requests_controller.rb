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
    render :text=>"", :layout=>'request'
  end

  def show
    @request = Request.find(params[:id])
    @countries = Country.all
    @car_types = CarType.all
    render :layout=>'request'
  end

end
