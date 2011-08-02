class ClientsController < ApplicationController
  before_filter :require_user

  def index
    conditions = params[:only_exp].eql?('true') ? "is_expeditor=true" : ""
    @clients = Client.all( 
      :conditions=>conditions,
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

  def update
    # Удаляем нахрен все ненужное из парамсов    
    params[:clients].reject!{|k,v| ['balance', 'id', 'created_at'].include?(k)}
    client = Client.update(params[:id], params[:clients])
    current_user.log('client.create', client.name, client.to_json) if client.errors.empty?
    render :json => {
      :success=>client.errors.empty?, 
      :clients=>client.as_json(:only=>[:id,:name,:address,:phone,:email,:director,:payment_details,:is_expeditor,:balance,:created_at])
    }
  end

  def create
    # Удаляем нахрен все ненужное из парамсов
    params[:clients].reject!{|k,v| ['balance', 'id', 'created_at', 'is_expeditor'].include?(k)}
    client = Client.create(params[:clients])
    current_user.log('client.create', client.name, client.to_json) if client.errors.empty?
    render :json => {
      :success=>client.errors.empty?, 
      :clients=>client.as_json(:only=>[:id,:name,:address,:phone,:email,:director,:payment_details,:is_expeditor,:balance,:created_at])
    }
  end

  def destroy
    client = Client.find_by_id(params[:id])
    current_user.log('client.remove', client.name, client.to_json)
    deleted_records_num = Client.delete(params[:id])
    @clients = Client.all( 
      :order=>"created_at DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    count = Client.count()
    render :json => {
      :success=>deleted_records_num.eql?(1), 
      :total=>count, 
      :clients=>@clients.as_json(:only=>[:id,:name,:address,:phone,:email,:director,:payment_details,:is_expeditor,:balance,:created_at])
    }
  end

end
