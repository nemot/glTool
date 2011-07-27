class UsersController < ApplicationController
  before_filter :require_user

  def index
    @users = User.all
    render :json => {:success=>true, :users=>@users.as_json(:only=>[:id,:login,:email, :fio, :position, :role_id], :methods=>:was_online)}
  end

  def roles
    @roles = Role.all
    render :json => {:success=>true, :roles=>@roles.as_json(:only=>[:id,:name])}
  end

  def create
    params[:user].merge!({:password_confirmation=>params[:user][:password]})
    @user = User.create(params[:user])
    message = t('user.cant_create') unless @user.errors.empty?
    render :json => {:success=>@user.errors.empty?, :message=>@user.errors.inspect}
  end

  def update
    params[:users].delete("was_online")
    @user = User.update(params[:id], params[:users])
    render :json => {:success=>@user.errors.empty?, :users=>User.all.as_json(:only=>[:id,:login,:email, :fio, :position, :role_id], :methods=>:was_online)}
  end

  def update_password
    @user = User.update(params[:id], {:password=>params[:new_password], :password_confirmation=>params[:new_password]})
    UserMailer.new_password(@user, params[:new_password]).deliver if params[:send_to_email].eql?('on') and @user.errors.empty?
    render :json => {:success=>@user.errors.empty?}
  end

  def destroy
    u = User.delete(params[:id])
    @users = User.all
    render :json => {:success=>u.eql?(1), :users=>@users.as_json(:only=>[:id,:login,:email, :fio, :position, :role_id], :methods=>:was_online)}
  end


end
