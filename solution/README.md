* FollowToggle
    * just change partial, applies everywhere!
    * handleClick/render
    * initial-follow-state, user-id data attributes
* UsersSearch
    * I expected a div, inserted input and ul tags.
    * Held an array of results
    * On "input" to the input tag, made ajax query, updated results.
    * Wrote renderResults method.
    * This built li and anchor tag.
    * Modified FollowToggle to take options; built even that.
    * Avoid underscore until the very end?
* TweetCompose
    * Decreasing counter of chars left (use input event).
    * AJAX submit (obviously)
    * Provide linked ul of tweets; insert on success.
    * Clear for reuse!
* TweetCompose II
    * Add mentioned-users div.
    * Put a script template in there. We'll write straight HTML.
    * Template should have select tag, plus a remove button. Put this
      in a span.
    * Have an "add new mention" link.
    * At start of TweetCompose, grab script template and compile.
    * Each time clicking the add new mention, clone template and insert.
    * Each time clicking remove link, remove the select/remove button.
* InfiniteTweets
    * First, write a `#fetchMore` method.
    * It should provide a `max_created_at` to the API.
    * You have to edit the User#feed_tweets to get it to use limit/max_created_at.
    * Have a div with a ul (for tweets) and a link for "Fetch More".
    * Bind click handler.
* At some point they need to use an underscore template.
    * They need this for InfiniteTweets
    * But it would also be useful for TweetCompose.
    * Maybe we can have them do TweetCompose the lame way, first.
* I think the most logical way to do this is to install a jquery event
  handler like I did.
    * Not sure how to sequence this, though. TweetCompose gets written
      before InfiniteTweets.
    * Also, can fix a bug by setting lastCreatedAt if needed.
