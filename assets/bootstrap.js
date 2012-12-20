
/*
Provide top-level namespaces for our javascript.
*/


(function() {

  window.cliqr || (window.cliqr = {
    config: {},
    model: {},
    router: {},
    ui: {}
  });

  jQuery(function($) {
    var model, question, questions;
    if ($('#cliqr-index').length) {
      questions = new cliqr.ui.QuestionsIndexView();
      console.log(questions.el);
    }
    if ($('#cliqr-show').length) {
      model = new cliqr.model.Question(cliqr.model.$currentQuestion);
      question = new cliqr.ui.QuestionView({
        model: model
      });
      console.log(question.render().el);
      setInterval(function() {
        return model.fetch();
      }, 2000);
    }
    return setTimeout((function() {
      return $(".self-destroy").remove();
    }), 5000);
  });

}).call(this);
