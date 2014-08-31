json.array!(@feed_tweets) do |tweet|
  json.(tweet, *Tweet.column_names)

  json.user(tweet.user, *User.column_names)
end
