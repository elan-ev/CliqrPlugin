
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

  cliqr.router.changeToPage = (function(previous) {
    return function(view) {
      var container, el, pages;
      if (previous) {
        previous.trigger('page-hide');
      }
      el = $(view.render().el);
      container = $("#layout_container");
      pages = container.children(".page");
      pages.not(el).hide('slide', {
        duration: 200,
        direction: 'left'
      }, function() {
        return el.show('slide', {
          duration: 200,
          direction: 'right'
        });
      });
      if (!pages.is(el)) {
        container.append(el);
      }
      return previous = view;
    };
  })(false);

  jQuery(function($) {
    var model, question, questions;
    setTimeout((function() {
      return $(".self-destroy").remove();
    }), 5000);
    if ($('#cliqr-index').length) {
      questions = new cliqr.ui.QuestionsIndexView({
        el: $('#cliqr-index .page')
      });
      cliqr.router.changeToPage(questions);
    }
    if ($('#cliqr-show').length) {
      model = new cliqr.model.Question(cliqr.model.$currentQuestion);
      setInterval((function() {
        return model.fetch();
      }), 2000);
      question = new cliqr.ui.QuestionView({
        el: $('#cliqr-show .page'),
        model: model
      });
      return cliqr.router.changeToPage(question);
    }
  });

}).call(this);
