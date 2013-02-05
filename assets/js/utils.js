(function() {

  define(['mustache', 'underscore'], function(Mustache, _) {
    var previousPages;
    previousPages = [];
    return {
      changeToPage: function(view) {
        var container, current, el, pages;
        el = $(view.render().el);
        container = $("#layout_container");
        pages = container.children(".page");
        current = _.last(previousPages);
        previousPages.push(view);
        if (!el[0].parentNode) {
          container.prepend(el.hide());
        }
        if (current) {
          current.trigger('page-hide').$el.hide();
        }
        el.show();
      },
      changeToPreviousPage: function() {
        var current, previous;
        if (previousPages.length < 2) {
          throw new Error('There is no previous page');
        }
        current = previousPages.pop();
        previous = _.last(previousPages);
        current.$el.hide();
        previous.$el.show();
        return current.remove();
      },
      compileTemplate: _.memoize(function(name) {
        return Mustache.compile($("#cliqr-template-" + name).html());
      })
    };
  });

}).call(this);
