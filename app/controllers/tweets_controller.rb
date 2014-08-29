class TweetsController < ApplicationController
  before_action :require_logged_in!

  def create
    @tweet = current_user.tweets.build(tweet_params)

    if @tweet.save
      redirect_to feed_url
    elsif
      render json: tweet.errors.full_messages
    end
  end

  private
  def tweet_params
    params.require(:tweet).permit(:content, mentioned_user_ids: [])
  end
end
