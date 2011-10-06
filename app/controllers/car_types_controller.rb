class CarTypesController < ApplicationController
  before_filter :require_user, :set_current_user

  def index
    nodes = CarType.all

    render :json => {:success=>true, :types=>nodes.as_json(:only=>[:id, :name])}
  end
end
