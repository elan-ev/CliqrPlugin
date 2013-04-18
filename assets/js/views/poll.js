// Generated by CoffeeScript 1.5.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'jquery', 'utils', 'views/helpers', 'views/page', 'models/id_list'], function(Backbone, jQuery, utils, helpers, PageView, id_list) {
    /*
    TODO: docu für pollview
    */

    var PollView;
    return PollView = (function(_super) {
      var timeout;

      __extends(PollView, _super);

      function PollView() {
        this.recordAnswer = __bind(this.recordAnswer, this);
        PollView.__super__.constructor.apply(this, arguments);
      }

      PollView.prototype.template = utils.compileTemplate("poll");

      PollView.prototype.className = "page";

      PollView.prototype.events = {
        "submit form": "recordAnswer"
      };

      PollView.prototype.initialize = function(options) {
        PollView.__super__.initialize.call(this, options);
        this.listenTo(this.collection, "all", this.update);
        return this.listenTo(Backbone, "pusher_connected", this.onPusherConnected);
      };

      PollView.prototype.update = function() {
        this.render();
        return this.postRender();
      };

      timeout = null;

      PollView.prototype.render = function() {
        var answer, context, index, _i, _len, _ref, _ref1;
        this.poll = this.collection.firstFresh();
        if (this.poll) {
          _ref = this.poll.get('answers');
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            answer = _ref[index];
            answer.nominal = helpers.nominal(index);
          }
        }
        context = {
          poll: (_ref1 = this.poll) != null ? _ref1.toJSON() : void 0
        };
        if (cliqr.config.pusherConnected) {
          this.setMode("pusher");
        }
        this.$el.html(this.template(context));
        return this;
      };

      PollView.prototype.postRender = function() {
        var _this = this;
        if (!cliqr.config.pusherConnected) {
          return timeout = setTimeout(function() {
            return _this.setMode("reload");
          }, 500);
        }
      };

      PollView.prototype.setMode = function(mode) {
        return this.$el.attr("data-mode", mode);
      };

      PollView.prototype.recordAnswer = function(event) {
        var _this = this;
        event.preventDefault();
        if (!id_list.test(this.poll)) {
          id_list.add(this.poll);
          return jQuery.post(cliqr.$Polls.url(), this.$("form").serialize()).done(function(msg) {
            return _this.update();
          }).fail(function(jqXHR, textStatus) {});
        } else {
          return alert("Question was already answered");
        }
      };

      PollView.prototype.onPusherConnected = function() {
        cliqr.config.pusherConnected = true;
        clearTimeout(timeout);
        return this.setMode("pusher");
      };

      return PollView;

    })(PageView);
  });

}).call(this);
