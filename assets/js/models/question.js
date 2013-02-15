(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var Question, actionMap;
    actionMap = {
      create: 'create',
      update: 'update',
      "delete": 'destroy',
      read: 'show'
    };
    return Question = (function(_super) {

      __extends(Question, _super);

      function Question() {
        return Question.__super__.constructor.apply(this, arguments);
      }

      Question.prototype.sync = function(method, model, options) {
        _.extend(options, {
          url: typeof model.url === "function" ? model.url(actionMap[method]) : void 0
        });
        return Backbone.sync(method, model, options);
      };

      Question.prototype.url = function(action) {
        var id;
        id = this.id != null ? "/" + this.id : "";
        return cliqr.config.PLUGIN_URL + ("questions/" + action + id + "?cid=") + cliqr.config.CID;
      };

      return Question;

    })(Backbone.Model);
  });

}).call(this);
