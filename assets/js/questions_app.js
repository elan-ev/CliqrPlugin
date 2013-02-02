(function() {

  define(['backbone', 'utils', 'models/question', 'views/questions_index', 'views/questions_show'], function(Backbone, utils, Question, QuestionsIndexView, QuestionView) {
    var QuestionsApp;
    return QuestionsApp = (function() {

      function QuestionsApp() {}

      QuestionsApp.prototype.initialize = function() {
        this.initStuff();
        return this.initPseudoRouter();
      };

      QuestionsApp.prototype.initStuff = function() {
        return setTimeout((function() {
          return $(".self-destroy").remove();
        }), 5000);
      };

      QuestionsApp.prototype.initPseudoRouter = function() {
        var model;
        if ($('#cliqr-index').length) {
          utils.changeToPage(new QuestionsIndexView({
            el: $('#cliqr-index .page')
          }));
        }
        if ($('#cliqr-show').length) {
          model = new Question(cliqr.model.$currentQuestion);
          setInterval((function() {
            return model.fetch();
          }), 2000);
          return utils.changeToPage(new QuestionView({
            el: $('#cliqr-show .page'),
            model: model
          }));
        }
      };

      return QuestionsApp;

    })();
  });

}).call(this);
