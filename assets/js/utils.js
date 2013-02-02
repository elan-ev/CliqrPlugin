(function() {

  define(['mustache', 'underscore'], function(Mustache, _) {
    var previousPage;
    previousPage = false;
    return {
      changeToPage: function(view) {
        var container, el, pages;
        if (previousPage) {
          previousPage.trigger('page-hide');
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
        return previousPage = view;
      },
      compileTemplate: _.memoize(function(name) {
        return Mustache.compile($("#cliqr-template-" + name).html());
      })
    };
  });

}).call(this);
