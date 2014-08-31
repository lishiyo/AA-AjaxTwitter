// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.serializejson
//= require underscore
//= require_tree .

$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState = this.$el.data("initial-follow-state") || options.followState;

  this.render();

  this.$el.on("click", this.handleClick.bind(this));
};

$.FollowToggle.prototype.handleClick = function (event) {
  var followToggle = this;

  event.preventDefault();

  if (this.followState == "followed") {
    this.followState = "following";
    this.render();

    $.ajax({
      url: "/users/" + this.userId + "/follow",
      dataType: "json",
      method: "DELETE",
      success: function () {
        followToggle.followState = "unfollowed";
        followToggle.render();
      }
    });
  } else if (this.followState == "unfollowed") {
    this.followState = "unfollowing"
    this.render();

    $.ajax({
      url: "/users/" + this.userId + "/follow",
      dataType: "json",
      method: "POST",
      success: function () {
        followToggle.followState = "followed";
        followToggle.render();
      }
    });
  }
};

$.FollowToggle.prototype.render = function () {
  if (this.followState == "followed") {
    this.$el.prop("disabled", false);
    this.$el.html("Unfollow!");
  } else if (this.followState == "unfollowed") {
    this.$el.prop("disabled", false);
    this.$el.html("Follow!");
  } else if (this.followState == "following") {
    this.$el.prop("disabled", true);
    this.$el.html("Following...");
  } else if (this.followState == "unfollowing") {
    this.$el.prop("disabled", true);
    this.$el.html("Unfollowing...");
  }
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};

$.UsersSearch = function (el) {
  this.$el = $(el);
  this.$input = $('<input type="text">');
  this.$ul = $("<ul></ul>");
  this.results = [];

  this.$el.append(this.$input);
  this.$el.append(this.$ul);

  this.$input.on("input", this.handleInput.bind(this));
};

$.UsersSearch.prototype.handleInput = function (event) {
  if (this.$input.val() == "") {
    this.results = [];
    this.renderResults();
    return;
  }

  var usersSearch = this;
  $.ajax({
    url: "/users/search",
    dataType: "json",
    method: "GET",
    data: { query: this.$input.val() },
    success: function (data) {
      usersSearch.results = data;
      usersSearch.renderResults();
    }
  });
};

$.UsersSearch.prototype.renderResults = function () {
  this.$ul.empty();

  for (var i = 0; i < this.results.length; i++) {
    var user = this.results[i];

    var $a = $("<a></a>");
    $a.text(user.username);
    $a.attr("href", "/users/" + user.id);

    var $followToggle = $("<button></button>");
    $followToggle.followToggle({
      userId: user.id,
      followState: user.followed ? "followed" : "unfollowed"
    });

    var $li = $("<li></li>");
    $li.append($a);
    $li.append($followToggle);

    this.$ul.append($li);
  }
};

$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};

$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$input = this.$el.find("textarea[name=tweet\\[content\\]]");
  this.$mentionedUsersDiv = this.$el.find(".mentioned-users");
  this.$mentionedUserTemplate = $(this.$mentionedUsersDiv.find("script").html())

  this.$input.on("input", this.handleInput.bind(this));
  this.$el.on("submit", this.submit.bind(this));
  this.$el.find("a.add-mentioned-user").on("click", this.addMentionedUser.bind(this));
  this.$mentionedUsersDiv.on("click", "a.remove-mentioned-user", this.removeMentionedUser.bind(this));
};

$.TweetCompose.prototype.addMentionedUser = function (event) {
  event.preventDefault();

  var $selectSpan = this.$mentionedUserTemplate.clone();
  this.$mentionedUsersDiv.append($selectSpan);
};

$.TweetCompose.prototype.clearInput = function () {
  this.$input.val("");
  this.$mentionedUsersDiv.empty();
  this.$el.find(":input").prop("disabled", false);
}

$.TweetCompose.prototype.handleInput = function (event) {
  var inputLength = this.$input.val().length;

  this.$el.find(".char-left").text(140 - inputLength + " characters left");
};

$.TweetCompose.prototype.handleSuccess = function (data) {
  var $tweetsUl = $(this.$el.data("tweets-ul"));

  var $li = $("<li></li>");
  $li.text(JSON.stringify(data));
  $tweetsUl.prepend($li);

  this.clearInput();
};

$.TweetCompose.prototype.removeMentionedUser = function (event) {
  event.preventDefault();
  $(event.currentTarget).parent().remove();
};

$.TweetCompose.prototype.submit = function (event) {
  event.preventDefault();

  var data = this.$el.serializeJSON();
  this.$el.find(":input").prop("disabled", true);

  $.ajax({
    url: "/tweets",
    method: "POST",
    data: data,
    dataType: "json",
    success: this.handleSuccess.bind(this)
  });
};

$.fn.tweetCompose = function () {
  return this.each(function () {
    new $.TweetCompose(this);
  });
};

$.InfiniteTweets = function (el) {
  this.$el = $(el);
  this.tweets = [];

  this.$el.on("click", ".fetch-more", this.fetchMore.bind(this));
};

$.InfiniteTweets.prototype.fetchMore = function (event) {
  event.preventDefault();

  var infiniteTweets = this;

  var options = {
    url: "/feed",
    dataType: "json",
    success: function (data) {
      infiniteTweets.renderTweets(data);

      if (data.length == 0) {
        infiniteTweets.$el.find(".fetch-more").replaceWith("<b>No more tweets!</b>");
      }

      infiniteTweets.tweets = infiniteTweets.tweets.concat(data)
    }
  };

  if (this.tweets.length > 0) {
    options.data = {
      max_created_at: this.tweets[this.tweets.length - 1].created_at
    };
  }

  $.ajax(options);
};

$.InfiniteTweets.prototype.renderTweets = function (data) {
  var tmpl = _.template(this.$el.find("script").html());
  this.$el.find("ul.tweets").append(tmpl({
    tweets: data
  }));
};

$.fn.infiniteTweets = function () {
  return this.each(function () {
    new $.InfiniteTweets(this);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
  $("div.users-search").usersSearch();
  $("form.tweet-compose").tweetCompose();
  $("div.infinite-tweets").infiniteTweets();
});
