(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'jquery', 'utils', 'views/helpers', 'views/page', 'models/id_list'], function(_, $, utils, helpers, PageView, id_list) {
    /*
      TODO: docu für pollview
    */

    var PollView;
    return PollView = (function(_super) {

      __extends(PollView, _super);

      function PollView() {
        this.recordAnswer = __bind(this.recordAnswer, this);
        return PollView.__super__.constructor.apply(this, arguments);
      }

      PollView.prototype.template = utils.compileTemplate("poll");

      PollView.prototype.events = {
        "submit form": "recordAnswer"
      };

      PollView.prototype.initialize = function(options) {
        PollView.__super__.initialize.call(this, options);
        return this.collection.on("all", this.render, this);
      };

      PollView.prototype.render = function() {
        var answer, index, poll, _i, _len, _ref;
        poll = this.collection.firstFresh();
        if (poll) {
          _ref = poll.get('answers');
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            answer = _ref[index];
            answer.nominal = helpers.nominal(index);
          }
        }
        this.$el.html(this.template({
          poll: poll != null ? poll.toJSON() : void 0
        }));
        return this;
      };

      PollView.prototype.recordAnswer = function(event) {
        var id,
          _this = this;
        event.preventDefault();
        id = this.$("input[name=vote_id]", event.target).val();
        if (id_list.test(id)) {
          return alert("ha!");
        } else {
          return $.post(cliqr.$Polls.url(), this.$("form").serialize()).always(function() {
            return id_list.add(id);
          }).done(function(msg) {
            return _this.render();
          }).fail(function(jqXHR, textStatus) {});
        }
      };

      return PollView;

    })(PageView);
  });

}).call(this);
