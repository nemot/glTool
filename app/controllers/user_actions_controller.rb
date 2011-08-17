class UserActionsController < ApplicationController
  before_filter :require_user

  def index
    @actions = UserAction.find_all_by_user_id(params[:user_id].to_i, 
      :order=>"created_at DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    count = UserAction.count(:conditions=>{:user_id=>params[:user_id].to_i})
    render :json => {
      :success=>true, 
      :total=>count, 
      :actions=>@actions.as_json(:only=>[:id,:entity,:created_at], :methods=>:humanized_action)
    }
  end

end
