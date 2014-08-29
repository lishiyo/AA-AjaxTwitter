class FollowsController < ApplicationController
  before_action :require_logged_in!

  def create
    @follow = current_user.out_follows.create!(followee_id: params[:user_id])
    redirect_to request.referrer
  end

  def destroy
    @follow = current_user.out_follows.find_by(followee_id: params[:user_id])
    @follow.destroy!

    redirect_to request.referrer
  end
end
