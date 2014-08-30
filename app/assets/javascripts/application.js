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

$.FollowToggle = function (el) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id");
  this.followState = this.$el.data("initial-follow-state");

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

$.fn.followToggle = function () {
  return this.each(function () {
    new $.FollowToggle(this);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});
