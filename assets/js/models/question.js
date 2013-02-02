(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var Question;
    return Question = (function(_super) {

      __extends(Question, _super);

      function Question() {
        return Question.__super__.constructor.apply(this, arguments);
      }

      Question.prototype.url = function() {
        return cliqr.config.PLUGIN_URL + ("questions/show/" + (this.get('id')) + "?cid=") + cliqr.config.CID;
      };

      return Question;

    })(Backbone.Model);
  });

}).call(this);
