Gl2::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  
  root :to=>"home#index"
   
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
      get 'expeditor_in_requests'
      get 'client_report'
      get 'exp_report'
      get 'pgk_report'
    end
    collection do
      get 'get_total_report'
      get 'autocomplete'
    end
  end
  put "clients/:id/users/:user_id" => "clients#update_permission"
  resources :client_transactions

  resources :bills do
    member do
      get 'get_invoice'
    end
    collection do
      post 'create_inbox'
    end
  end

  resources :requests
  resources :stations
  resources :loads
  resources :car_types
  resources :places
  resources :deltas do 
    collection do 
      get :total
    end
  end
  

end
