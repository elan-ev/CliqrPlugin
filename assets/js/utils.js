(function() {

  define(['handlebars', 'underscore'], function(Handlebars, _) {
    var previousPages;
    previousPages = [];
    return {
      changeToPage: function(view) {
        var container, current, pages;
        container = $("#layout_container");
        pages = container.children(".page");
        current = _.last(previousPages);
        previousPages.push(view);
        if (current) {
          current.$el.hide();
          Backbone.trigger('page-after-hide', current);
        }
        view.render();
        if (!view.el.parentNode) {
          container.prepend(view.$el.hide());
        }
        Backbone.trigger('page-before-show', view);
        view.$el.show();
        return Backbone.trigger('page-after-show', view);
      },
      changeToPreviousPage: function() {
        var current, previous;
        if (previousPages.length < 2) {
          throw new Error('There is no previous page');
        }
        current = previousPages.pop();
        previous = _.last(previousPages);
        current.$el.hide();
        Backbone.trigger('page-after-hide', current);
        Backbone.trigger('page-before-show', previous);
        previous.$el.show();
        Backbone.trigger('page-after-show', previous);
        return current.remove();
      },
      compileTemplate: _.memoize(function(name) {
        return Handlebars.compile($("#cliqr-template-" + name).html());
      })
    };
  });

}).call(this);