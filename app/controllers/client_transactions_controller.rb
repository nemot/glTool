class ClientTransactionsController < ApplicationController
  
  before_filter :require_user

  def index
    nodes = Transaction.find_all_by_client_id( params[:client_id].to_i,
      :order=>"date_of_transfer DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    count = Transaction.count(:conditions=>{:client_id=>params[:client_id].to_i})
    render :json => {
      :success=>true, 
      :total=>count, 
      :transactions=>nodes.as_json(:only=>[:id,:value,:description,:date_of_transfer])
    }
  end

  def create
    # Удаляем нахрен все ненужное из парамсов и добавляем клиента
    params[:transactions].reject!{|k,v| ['id'].include?(k)}.merge!({:client_id=>params[:client_id]})
    node = Transaction.create(params[:transactions])
    # Пишем в лог пользователя операцию
    current_user.log('transaction.create', node.name_for_user_log, node.to_json) if node.errors.empty?

    render :json => {
      :success=>node.errors.empty?, 
      :transactions=>node.as_json(:only=>[:id,:value,:description,:date_of_transfer])
    }
  end


  def update
    # Удаляем нахрен все ненужное из парамсов    
    params[:transactions].reject!{|k,v| ['id'].include?(k)}
    node = Transaction.update(params[:id], params[:transactions])
    # Пишем в лог пользователя операцию
    current_user.log('transaction.update', node.name_for_user_log, node.to_json) if node.errors.empty?

    render :json => {
      :success=>node.errors.empty?, 
      :transactions=>node.as_json(:only=>[:id,:value,:description,:date_of_transfer])
    }
  end

  def destroy
    node = Transaction.find_by_id(params[:id])
    # Пишем в лог пользователя операцию
    current_user.log('transaction.remove', node.name_for_user_log, node.to_json) if node.errors.empty?
    deleted_records_num = Transaction.delete(params[:id])
    
    nodes = Transaction.find_all_by_client_id( params[:client_id].to_i,
      :order=>"date_of_transfer DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    count = Transaction.count(:conditions=>{:client_id=>params[:client_id].to_i})
    render :json => {
      :success=>deleted_records_num.eql?(1), 
      :total=>count, 
      :transactions=>nodes.as_json(:only=>[:id,:value,:description,:date_of_transfer])
    }
  end


end
