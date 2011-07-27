class UserMailer < ActionMailer::Base
  default :from => "admin@greenline-trans.co.uk"

  def new_password(user, password)  
    @password = password; @user = user;
    mail(:to => @user.email, :subject => "GreenLineTool: Ваш пароль был изменен")  
  end  
end
