AjaxTwitter::Application.routes.draw do
  resource :feed, only: [:show]
  resource :session, only: [:create, :destroy, :new]
  resources :users, only: [:create, :new, :show]

  root to: redirect("/feed")
end
