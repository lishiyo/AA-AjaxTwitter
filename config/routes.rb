AjaxTwitter::Application.routes.draw do
  resource :session, only: [:create, :destroy, :new]
  resources :users, only: [:create, :new, :show]
end
