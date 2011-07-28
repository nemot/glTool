class UserSessionsController < ApplicationController
  before_filter :require_user, :only => :destroy
  layout 'authentication'
 
  def new
    @user_session = UserSession.new
  end
 
  def create
    @user_session = UserSession.new(params[:user_session])
    if @user_session.save
      flash[:notice] = t('session.notice.signed_in')
      current_user.log 'logged_in'
      redirect_to root_path
    else
      flash[:error] = t('session.notice.sign_in_failed')
      render :action=>:new
    end
  end
 
  def destroy
    current_user.log 'logged_out'
    current_user_session.destroy
    flash[:notice] = t('session.notice.signed_out')
    redirect_to root_url
  end

end
