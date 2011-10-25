class ClientsController < ApplicationController
  before_filter :require_user, :set_current_user
  before_filter :no_engineer, :only=>[:users, :update_permission]
  before_filter :engineer_has_access, :only=>[:update, :destroy]


  # To json params
  @@client_fields = [:id,:name,:address,:phone,:email,:director,:payment_details,:is_expeditor,:balance,:created_at];

  def users
    @users = User.all
    @users.each{|u| u.client_id = params[:id]}

    render :json => {
      :success=>true, 
      :users=>@users.as_json(
        :only=>[:id,:login, :fio, :role_id], 
        :methods=>[:has_access_to_client?, :role_name]
      )
    }
  end

  def update_permission
    # Логируем
    client = Client.find_by_id(params[:id])
    current_user.log( 
      'client.update_permission_'+params[:users][:has_access_to_client?].to_s, 
      '"'+client.name+'" для пользователя "'+User.find_by_id(params[:user_id]).login+'"',
      client.to_json(:include=>:users)
    )
    
    User.find_by_id(params[:user_id]).set_access_to_client(params[:id], params[:users][:has_access_to_client?])
    @users = User.all
    @users.each{|u| u.client_id = params[:id]}
    render :json => {
      :success=>true, 
      :users=>@users.as_json(
        :only=>[:id,:login, :fio, :role_id], 
        :methods=>[:has_access_to_client?, :role_name]
      )
    }
  end

  def autocomplete
    conditions = "name LIKE('%#{params[:query]}%')"
    stations = Client.find(:all, 
      :conditions=>conditions,
      :order=>"id DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    total = Client.count(:conditions=>conditions)
    render :json => {:success=>true, :total=>total, :nodes=>stations.as_json(:only=>[:id, :name])}
  end

  def index
    conditions = params[:only_exp].eql?('true') ? "is_expeditor=true " : " 1=1 "
    
    # Проверка доступности инженерам
    conditions << "AND id IN(SELECT client_id FROM client_users WHERE user_id=#{current_user.id})" if current_user.is_engineer?

    @clients = Client.all( 
      :conditions=>conditions,
      :order=>"created_at DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )

    count = Client.count(:conditions=>conditions)
    render :json => {
      :success=>true, 
      :total=>count, 
      :clients=>@clients.as_json(:only=>@@client_fields)
    }
  end

  def update
    # Удаляем нахрен все ненужное из парамсов    
    params[:clients].reject!{|k,v| ['balance', 'id', 'created_at'].include?(k)}
    client = Client.update(params[:id], params[:clients])
    current_user.log('client.update', client.name, client.to_json) if client.errors.empty?
    render :json => {
      :success=>client.errors.empty?, 
      :clients=>client.as_json(:only=>@@client_fields)
    }
  end

  def create
    # Удаляем нахрен все ненужное из парамсов
    params[:clients].reject!{|k,v| ['balance', 'id', 'created_at', 'is_expeditor'].include?(k)}
    client = Client.create(params[:clients])
    current_user.log('client.create', client.name, client.to_json) if client.errors.empty?
    client.users << current_user
    render :json => {
      :success=>client.errors.empty?, 
      :clients=>client.as_json(:only=>@@client_fields)
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
      :clients=>@clients.as_json(:only=>@@client_fields)
    }
  end


  private 
  
  def engineer_has_access
    client = Client.find_by_id(params[:id])
    if client.nil? or !client.users.exists?(current_user)
      redirect_to root_path
      return true
    end
    return true
  end

end


