(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'utils', 'models/question', 'models/questions', 'views/questions_index', 'views/questions_new', 'views/questions_edit'], function(Backbone, utils, Question, QuestionCollection, QuestionsIndexView, QuestionsNewView, QuestionsEditView) {
    var QuestionsRouter;
    return QuestionsRouter = (function(_super) {
      var loader, timeout;

      __extends(QuestionsRouter, _super);

      function QuestionsRouter() {
        return QuestionsRouter.__super__.constructor.apply(this, arguments);
      }

      QuestionsRouter.prototype.routes = {
        "": "index",
        "index": "index",
        "new": "newQuestion",
        "edit-:id": "editQuestion"
      };

      QuestionsRouter.prototype.index = function() {
        var _this = this;
        this.showLoading();
        return this.fetchQuestions(function(questions) {
          _this.hideLoading();
          return utils.changeToPage(new QuestionsIndexView({
            collection: questions
          }));
        });
      };

      QuestionsRouter.prototype.newQuestion = function() {
        return utils.changeToPage(new QuestionsNewView);
      };

      QuestionsRouter.prototype.editQuestion = function(id) {
        var _this = this;
        this.showLoading();
        return this.fetchQuestion(id, function(question) {
          utils.changeToPage(new QuestionsEditView({
            model: question
          }));
          return _this.hideLoading();
        });
      };

      QuestionsRouter.prototype.fetchQuestions = function(callback) {
        var questions;
        if (cliqr.config.POLLS) {
          questions = new QuestionCollection(cliqr.config.POLLS);
          delete cliqr.config.POLLS;
          return callback(questions);
        } else {
          questions = new QuestionCollection;
          return questions.fetch().done(function() {
            return callback(questions);
          });
        }
      };

      QuestionsRouter.prototype.fetchQuestion = function(id, callback) {
        var question, questions,
          _this = this;
        if (cliqr.config.POLLS) {
          questions = new QuestionCollection(cliqr.config.POLLS);
          delete cliqr.config.POLLS;
          return callback(questions.get(id));
        } else {
          question = new Question({
            id: id
          });
          return question.fetch().done(function() {
            return callback(question);
          });
        }
      };

      loader = false;

      timeout = false;

      QuestionsRouter.prototype.showLoading = function() {
        return timeout = setTimeout(function() {
          return loader = $('<span class="cliqr-loader"/>').html("Loading...").prependTo("#layout_container");
        }, 300);
      };

      QuestionsRouter.prototype.hideLoading = function() {
        clearTimeout(timeout);
        if (loader) {
          return loader.remove();
        }
      };

      return QuestionsRouter;

    })(Backbone.Router);
  });

}).call(this);
