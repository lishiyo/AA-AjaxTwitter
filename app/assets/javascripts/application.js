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

$(function () {
  $("button.follow-toggle").followToggle();
  $("div.users-search").usersSearch();
});
