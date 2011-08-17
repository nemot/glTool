class ApplicationController < ActionController::Base
#  protect_from_forgery
  helper_method :current_user_session, :current_user
  
  ActiveRecord::Base.include_root_in_json = false




  private

  def set_current_user   
    UserInfo.current_user = @current_user
    return true
  end

  def current_user_session
    return @current_user_session if defined?(@current_user_session)
    @current_user_session = UserSession.find
  end
 
  def current_user
    return @current_user if defined?(@current_user)
    @current_user = current_user_session && current_user_session.user
  end
 
  def require_user
    unless current_user
      flash[:notice] = t('session.notice.sign_in_needed')
      redirect_to sign_in_path
      return false
    end
    true
  end

  def no_engineer
    if current_user.is_engineer? # Если инженер
      redirect_to root_path
      return true
    end
    true
  end


end
