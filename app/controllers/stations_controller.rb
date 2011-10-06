class StationsController < ApplicationController
  before_filter :require_user, :set_current_user

  def index
    conditions = "name LIKE('%#{params[:query]}%') OR short_name LIKE('%#{params[:query]}%') OR code LIKE('%#{params[:query]}%')"
    stations = Station.find(:all, 
      :conditions=>conditions,
      :order=>"id DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    total = Station.count( :conditions=>conditions)
    render :json => {:success=>true, :total=>total, :nodes=>stations.as_json(:only=>[:id, :name])}
  end
end
