(function() {

  define(['utils', 'models/question', 'models/questions', 'views/questions_index', 'views/questions_show', 'routers/questions'], function(utils, Question, QuestionCollection, QuestionsIndexView, QuestionView, QuestionsRouter) {
    var QuestionsApp;
    return QuestionsApp = (function() {

      function QuestionsApp() {}

      QuestionsApp.prototype.initialize = function() {
        this.initStuff();
        this.initRouters();
        this.initPseudoRouter();
        return Backbone.history.start();
      };

      QuestionsApp.prototype.initStuff = function() {
        return setTimeout((function() {
          return $(".self-destroy").remove();
        }), 5000);
      };

      QuestionsApp.prototype.initRouters = function() {
        var router;
        return router = new QuestionsRouter;
      };

      QuestionsApp.prototype.initPseudoRouter = function() {
        var model;
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
