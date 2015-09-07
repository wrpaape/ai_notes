Rails.application.routes.draw do
  resources :tests
  root "tests#index"
end
