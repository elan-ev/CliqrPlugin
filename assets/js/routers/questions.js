(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'utils', 'models/questions', 'views/questions_index'], function(Backbone, utils, QuestionCollection, QuestionsIndexView) {
    var QuestionsRouter;
    return QuestionsRouter = (function(_super) {

      __extends(QuestionsRouter, _super);

      function QuestionsRouter() {
        return QuestionsRouter.__super__.constructor.apply(this, arguments);
      }

      QuestionsRouter.prototype.routes = {
        "": "index"
      };

      QuestionsRouter.prototype.index = function() {
        var questions;
        questions = new QuestionCollection(cliqr.config.POLLS);
        return utils.changeToPage(new QuestionsIndexView({
          collection: questions
        }));
      };

      return QuestionsRouter;

    })(Backbone.Router);
  });

}).call(this);
