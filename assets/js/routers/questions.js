(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'utils', 'models/questions', 'views/questions_index', 'views/questions_form'], function(Backbone, utils, QuestionCollection, QuestionsIndexView, QuestionsForm) {
    var QuestionsRouter;
    return QuestionsRouter = (function(_super) {

      __extends(QuestionsRouter, _super);

      function QuestionsRouter() {
        return QuestionsRouter.__super__.constructor.apply(this, arguments);
      }

      QuestionsRouter.prototype.routes = {
        "": "index",
        "new": "newQuestion"
      };

      QuestionsRouter.prototype.index = function() {
        var questions;
        questions = new QuestionCollection(cliqr.config.POLLS);
        return utils.changeToPage(new QuestionsIndexView({
          collection: questions
        }));
      };

      QuestionsRouter.prototype.newQuestion = function() {
        return utils.changeToPage(new QuestionsForm);
      };

      return QuestionsRouter;

    })(Backbone.Router);
  });

}).call(this);
