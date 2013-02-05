(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'models/poll', 'models/id_list'], function(Backbone, Poll, id_list) {
    /*
      TODO: docs für PollCollection
    */

    var PollCollection;
    return PollCollection = (function(_super) {

      __extends(PollCollection, _super);

      function PollCollection() {
        return PollCollection.__super__.constructor.apply(this, arguments);
      }

      PollCollection.prototype.model = Poll;

      PollCollection.prototype.url = function() {
        return cliqr.config.PLUGIN_URL + "poll/" + cliqr.config.CID;
      };

      PollCollection.prototype.comparator = function(poll) {
        return poll.get('startdate');
      };

      PollCollection.prototype.firstFresh = function() {
        return this.find(function(model) {
          return !id_list.test(model);
        });
      };

      return PollCollection;

    })(Backbone.Collection);
  });

}).call(this);
