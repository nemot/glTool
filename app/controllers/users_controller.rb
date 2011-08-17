class UsersController < ApplicationController
  before_filter :require_user
  before_filter :no_engineer

  def index
    @users = User.all
    render :json => {:success=>true, :users=>@users.as_json(:only=>[:id,:login,:email, :fio, :position, :role_id], :methods=>:was_online)}
  end

  def show
    @user = User.find_by_id(params[:id])
    render :json => {:success=>true, :users=>@user.as_json(:only=>[:id,:login,:email, :fio, :position, :role_id], :methods=>:was_online)}
  end

  def roles
    @roles = Role.all
    render :json => {:success=>true, :roles=>@roles.as_json(:only=>[:id,:name])}
  end

  def create
    params[:user].merge!({:password_confirmation=>params[:user][:password]})
    @user = User.create(params[:user])
    if @user.errors.empty?
      UserMailer.registration(@user, params[:user][:password]).deliver 
      current_user.log('user.create', @user.fio, @user.to_json)
    end
    render :json => {:success=>@user.errors.empty?, :message=>@user.errors.inspect}
  end

  def update
    params[:users].delete("was_online")
    @user = User.update(params[:id], params[:users])
    current_user.log('user.update', @user.fio, @user.to_json)
    render :json => {:success=>@user.errors.empty?, :users=>User.all.as_json(:only=>[:id,:login,:email, :fio, :position, :role_id], :methods=>:was_online)}
  end

  def update_password
    @user = User.update(params[:id], {:password=>params[:new_password], :password_confirmation=>params[:new_password]})
    UserMailer.new_password(@user, params[:new_password]).deliver if params[:send_to_email].eql?('on') and @user.errors.empty?
    current_user.log('user.update_password', @user.fio, @user.to_json) if @user.errors.empty?
    render :json => {:success=>@user.errors.empty?}
  end

  def destroy
    @user = User.find_by_id(params[:id])
    current_user.log('user.remove', @user.fio, @user.to_json)
    u = User.delete(params[:id])
    @users = User.all
    render :json => {:success=>u.eql?(1), :users=>@users.as_json(:only=>[:id,:login,:email, :fio, :position, :role_id], :methods=>:was_online)}
  end


end
