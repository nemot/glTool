class DeltasController < ApplicationController
  before_filter :require_user, :set_current_user, :no_engineer

  def total
    render :json=>{:success=>true, :total=>(Client.sum('delta')-DeltaPayment.sum('sum')).to_f.round(2)}
  end
  
  def index
    params[:limit]=25 if params[:limit].nil?
    nodes = DeltaPayment.all(:order=>"date_of_transfer DESC",:offset=>params[:start].to_i||0, :limit=>params[:limit])
    render :json => {:success=>true, :nodes=>nodes.as_json, :total=>DeltaPayment.count}
  end

  def update
    node = DeltaPayment.update(params[:id], params[:nodes].reject{|k,v| k.eql?("created_at") or k.eql?("id")})
    render :json=>{:success=>node.save!, :nodes=>node.as_json}
  end

  def create
    node = DeltaPayment.new(params[:nodes].reject{|k,v| k.eql?("created_at") or k.eql?("id")})
    render :json=>{:success=>node.save!, :nodes=>node.as_json}
  end

  def destroy
    node = DeltaPayment.find_by_id(params[:id])
    if node
      current_user.log('delta.destroy', node.to_log, node.to_json)
      node.destroy
      render :json=>{:success=>node.destroyed?}
      return
    end
    render :json=>{:success=>false}
    
  end

end
