class UserMailer < ActionMailer::Base
  default :from => "admin@greenline-trans.co.uk"

  def new_password(user, password)  
    @password = password; @user = user;
    mail(:to => @user.email, :subject => "GreenLineTool: Изменен пароль")  
  end  

  def registration(user, password)
    @password = password; @user = user;
    mail(:to => @user.email, :subject => "GreenLineTool: Регистрация в системе")  
  end
end
