class ClientsController < ApplicationController
  before_filter :require_user

  def index
    @clients = Client.all( 
      :order=>"created_at DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    count = Client.count()
    render :json => {
      :success=>true, 
      :total=>count, 
      :clients=>@clients.as_json(:only=>[:id,:name,:address,:phone,:email,:director,:payment_details,:is_expeditor,:balance,:created_at])
    }
  end
end
