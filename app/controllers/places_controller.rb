class PlacesController < ApplicationController
  before_filter :require_user, :set_current_user

  def index
    nodes = Request.find_by_id(params[:request_id]).places
    render :json => {:success=>true, :nodes=>nodes.as_json(:methods=>[:country_name, :expeditor_name])}
  end
end
