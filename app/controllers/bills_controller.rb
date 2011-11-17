class BillsController < ApplicationController
  before_filter :require_user, :set_current_user

  @@bill_fields = [
    :id, :client_id, :created_user_id, :inbox, :number, :summ, :backwash, :sent, :sent_at, :payed, :payed_at, :created_at
  ]
  @@bill_methods = [
    :created_user_name, :client_name
  ]

  def index
    params[:inbox] = params[:inbox].eql?("true") # Пофильтруем =)

    conditions = "inbox=#{params[:inbox]}"

    bills = Bill.find(:all, 
      :conditions=>conditions,
      :order=>"id DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )
    total = Bill.count( :conditions=>conditions)
    render :json => {:success=>true, :total=>total, :bills=>bills.as_json(:only=>@@bill_fields, :methods=>@@bill_methods)}
  end


  def create
    params[:bill] = ActiveSupport::JSON.decode(params[:bill])
    if params[:bill]["id"].eql?("") || !Bill.find_by_id(params[:bill]["id"])
      bill = Bill.create(params[:bill].reject{|k,v| ["id","request"].include?(k)}.merge({:created_user_id=>current_user.id}))
    else
      bill = Bill.update(params[:bill]["id"], params[:bill])
    end
    params[:bill]["request"].each{|i| 
      Request.update(i, :has_invoice=>true);
      BillRequest.create( { :request_id=>i, :bill_id=>bill.id } )
    }
    render :json=>{:success=>true}
  end

end
