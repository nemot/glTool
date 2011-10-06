class LoadsController < ApplicationController
  before_filter :require_user, :set_current_user

  def index
    conditions = "name LIKE('%#{params[:query]}%') OR gng LIKE('%#{params[:query]}%') "
    nodes = Load.find(:all, 
      :conditions=>conditions,
      :order=>"id DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    total = Load.count( :conditions=>conditions)
    render :json => {:success=>true, :total=>total, :nodes=>nodes.as_json(:only=>[:id, :name])}
  end
end
