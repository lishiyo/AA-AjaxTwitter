# AJAX Twitter

## Phase I: `FollowToggle`

We will write a jQuery plugin that turns a button into a toggle that
will follow/unfollow a user.

Look at `app/views/follows/_form.html.erb`. This is the form we want
to replace with a single button. Notice that there are two branches of
logic: we need to present a follow button if the current user is not
following the user yet, and an unfollow if they are.

We want to replace this with a single `button`. We'll need to let the
button know the `user-id` and `initial-follow-state`: I stored these
in `data-*` attributes. I also gave the button a class of
`follow-toggle`. I left the inner HTML of the button empty: the jQuery
plugin will be responsible for setting this.

Like all jQuery plugins, you should define it like so:

```js
$.FollowToggle = function (el) {
  // ...
};

$.FollowToggle.prototype.method1 = function () {
  // ...
};

$.followToggle = function () {
  return this.each(function () {
    new $.FollowToggle(this);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});
```

This will build a `FollowToggle` instance for each follow toggle
button on the page.

Now let's start writing the code. In the constructor, extract the
`user-id` and `initial-follow-state` from `el` and save those in
instance variables `userId` and `followState` for later use.

Next, write a `FollowToggle#render` method. Depending on
`this.followState`, the text should be `"Follow!"` if
`this.followState == "unfollowed"`, and `"Unfollow!"` if
`this.followState == "followed"`.

Call your `#render` method inside the constructor to initially set the
inner HTML.

Next, write a `FollowToggle#handleClick` method. Install this click
handler in the constructor. Your click handler should:

0. Prevent the default action.
0. Make a `$.ajax` request to `POST` `/users/:id/follow` if we are not
   following the user (check `followState`).
0. Else, it should make a `DELETE` request.
0. On success of the `POST`/`DELETE`, we should toggle the
   `followState` and re-render.

Check to make sure this works! **Hint**: you probably want to use the
`dataType` `$.ajax` option.

Lastly, let's freeze-out the button so that people can't click it
while the AJAX request is pending. To do this, in `handleClick`, I
would set `followState` to `following` or `unfollowing` and call
`#render`. My `#render` method would set the `disabled` property
(using `$.fn.property`) if `following`/`unfollowing`. I set the
disabled property to false if `followState` is
`followed`/`unfollowed`.

Check that everything works and call over your TA so that they can
check your work!

## Phase II: `UsersSearch`

Review `app/controllers/users_controller.rb` and
`app/views/users/search.html.erb`. We want to make the searching
interactive.

To do this, we'll write a `UsersSearch` plugin. First, replace the
HTML. You'll want a `div` with class `users-search`. Add an input tag
for the user to type the name. Nested in the `div.users-search`, have
a `ul.users`.

Next, begin writin gthe `UsersSearch` plugin. As before, automatically
build a `UsersSearch` for each `div.users-search`. The key will be
installing a listener for the `input` even on the input tag.

Write a `UsersSearch#handleInput` handler. On each input event, make
an AJAX request to `/users/search`. Again, set the `dataType` option.
This time, upload the input's `val` as the query parameter: use the
`data` option of `$.ajax`.

For your AJAX success handler, write a method
`UsersSearch#renderResults`. This should first empty out `ul.users`.
Then it should iterate through the fetched array of users. For each
result, it should use jQuery to build an `li` containing an anchor tag
linking to the user. Use the jQuery `append` method to add each result
to the `ul`.

Check that you can now interactively search users.

Last, we want to add follow toggle buttons for each of these results.
When building the `li` tags for each user, build a `button`, too. You
can call `#followToggle` on the button to setup the follow toggle.

You could make this work by setting data attributes for `user-id` and
`initial-follow-state`. In this context, that's kind of annoying.
Instead, it is common to allow jQuery plugins to take options. I
modified my `FollowToggle` like so:

```js
$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState = this.$el.data("initial-follow-state") || options.followState;
  // ...
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};
```

See if this helps you set up the follow toggle.

## Phase III: `TweetCompose`

## TODO

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
