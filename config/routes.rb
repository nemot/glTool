Gl2::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  
  root :to=>"statements#index"
   
  #for user_sessions
  get   "sign_in"   => "user_sessions#new"
  post  "sign_in"   => "user_sessions#create"
  match "sign_out"  => "user_sessions#destroy"

  get "actions/:user_id" => "user_actions#index"
  resources :users do 
    collection do
      get 'roles'
    end
    member do
      post 'update_password'
    end
  end

  resources :clients do
    member do
      get 'users'
    end
  end
  put "clients/:id/users/:user_id" => "clients#update_permission"
  resources :client_transactions

end
