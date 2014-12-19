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
//= require underscore
//= require_tree .

$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState = this.$el.data("initial-follow-state") || options.followState;

  this.render();
  this.$el.on('click', this.handleClick.bind(this));
};

$.FollowToggle.prototype.render = function () {
  var text = (this.followState==="followed" ? "Unfollow!" : "Follow!")
  this.$el.text(text);

  if (this.followState === "following" || this.followState === "unfollowing") {
    this.$el.prop("disabled", true);
  } else {
    this.$el.prop("disabled", false);
  }
};

$.FollowToggle.prototype.handleClick = function(event) {
  event.preventDefault();
  if (this.followState === "following" || this.followState === "unfollowing") {
    return;
  }

  var req = (this.followState==="followed" ? "DELETE" : "POST");
  this.followState = (this.followState === "followed") ? "unfollowing" : "following";
  this.render();

  $.ajax({
    url: '/users/' + this.userId + '/follow',
    type: req,
    dataType: 'json',
    success: function(resp) {
      this.toggleFollowState();
      this.render();
    }.bind(this),
    error: function(req, status, err) {
      console.log('somethign went wrong' + req + status + err);
    }
  })
}

$.FollowToggle.prototype.toggleFollowState = function () {
  this.followState = ((this.followState === "unfollowing") ? "unfollowed" : "followed");
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});
