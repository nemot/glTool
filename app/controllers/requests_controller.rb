class RequestsController < ApplicationController
  before_filter :require_user

  def index
    render :nothing=>true
  end

end
