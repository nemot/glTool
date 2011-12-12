class BillsController < ApplicationController
  before_filter :require_user, :set_current_user
  include GlReports

  @@bill_fields = [
    :id, :client_id, :created_user_id, :inbox, :number, :summ, :backwash, :sent, :sent_at, :payed, :payed_at, :created_at
  ]
  @@bill_methods = [
    :created_user_name, :client_name, :requests_count
  ]

  def create_inbox
    params[:bill] = ActiveSupport::JSON.decode(params[:bill])
    params[:bill]["summ"].gsub!(',','.').to_f.round(2)
    if params[:bill]["id"].eql?("") || !Bill.find_by_id(params[:bill]["id"])
      bill = Bill.create(params[:bill].reject{|k,v| ["id","request"].include?(k)}.merge({:created_user_id=>current_user.id,:inbox=>true}))
      current_user.log('bill.inbox_create', bill.log_string, bill.to_json)
    else
      bill = Bill.update(params[:bill]["id"], params[:bill].reject{|k,v| ["id","request"].include?(k)})
      current_user.log('bill.inbox_update', bill.log_string, bill.to_json)
    end
    render :json=>{:success=>true, :bill=>bill.as_json(:only=>@@bill_fields, :methods=>@@bill_methods)}
  end

  def update
    bill = Bill.find_by_id(params[:bills]["id"])
    if bill
      if params[:bills]["sent_at"]
        bill.sent_at = params[:bills]["sent_at"].to_datetime
        bill.sent = true
        current_user.log('bill.sent', bill.log_string, bill.to_json)
      else
        bill.sent_at = nil
        bill.sent = false
        current_user.log('bill.unsent', bill.log_string, bill.to_json)
      end
      if params[:bills]["payed_at"]
        bill.payed_at = params[:bills]["payed_at"].to_datetime
        bill.payed = true
        current_user.log('bill.payed', bill.log_string, bill.to_json)
      else
        bill.payed_at = nil
        bill.payed = false
        current_user.log('bill.unpayed', bill.log_string, bill.to_json)
      end
      bill.save!
      render :json=>{:success=>true, :bills=>bill.as_json(:only=>@@bill_fields, :methods=>@@bill_methods)}
    else
      render :json=>{:success=>false}
    end
    
  end

  def index
    conditions = "inbox=#{params[:inbox].eql?("true")}"
    conditions << " AND client_id IN(SELECT client_id FROM client_users WHERE user_id=#{current_user.id}) " if current_user.is_engineer?
    conditions << " AND sent=true AND payed=false " if params[:only_unpayed].eql?('true')

    bills = Bill.find(:all, 
      :conditions=>conditions,
      :order=>"id DESC", 
      :offset=>params[:start].to_i, 
      :limit=>params[:limit].to_i
    )

    total = Bill.count( :conditions=>conditions)
    render :json => {:success=>true, :total=>total, :bills=>bills.as_json(:only=>@@bill_fields, :methods=>@@bill_methods)}
  end

  def new
    bill = Bill.new(:number=>Bill.next_number)
    render :json=>{:success=>true, :bill=>bill.as_json(:only=>@@bill_fields, :methods=>@@bill_methods,
      :include=>{:requests=>{:only=>RequestsController::json_params,:methods=>RequestsController::json_methods}}
    )}
  end

  def show
    bill = Bill.find_by_id(params[:id])
    render :json=>{:success=>!bill.nil?, :bill=>bill.as_json(:only=>@@bill_fields, :methods=>@@bill_methods, 
      :include=>{:requests=>{:only=>RequestsController::json_params,:methods=>RequestsController::json_methods}}
    )}
  end

  def get_invoice
    bill = Bill.find_by_id(params[:id])
    if bill
      send_file "lib/bills/outbox/#{params[:id].to_i}.xls", :filename=>"#{bill.number}-#{bill.client_name}-#{bill.created_at.strftime('%d.%m.%y')}.xls"
    else
      render :text=>"Нет такого файла!"
    end
  end
  
  def create
    params[:bill] = ActiveSupport::JSON.decode(params[:bill])
    params[:bill]["summ"].gsub!(',','.').to_f.round(2)
    if params[:bill]["id"].eql?("") || !Bill.find_by_id(params[:bill]["id"])
      bill = Bill.create(params[:bill].reject{|k,v| ["id","request"].include?(k)}.merge({:created_user_id=>current_user.id}))
      current_user.log('bill.create', bill.log_string, bill.to_json)
    else
      bill = Bill.update(params[:bill]["id"], params[:bill].reject{|k,v| ["id","request"].include?(k)})
      bill.requests.each{|r| r.has_invoice=false; r.save!}
      bill.bill_requests.delete_all
      current_user.log('bill.update', bill.log_string, bill.to_json)
    end
    params[:bill]["request"].each{|i| 
      Request.update(i, :has_invoice=>true);
      BillRequest.create( { :request_id=>i, :bill_id=>bill.id } )
    }
    bill.save!

    GlReports::invoice(bill)
    render :json=>{:success=>true, :bill=>bill.as_json(:only=>@@bill_fields, :methods=>@@bill_methods)}
  end

end
