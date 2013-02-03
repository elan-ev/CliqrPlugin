(function() {

  define(['backbone', 'jquery'], function(Backbone, $) {
    /*
      TODO: docu für pollview
    */

    var PageView;
    return PageView = (function() {
      var enhancePage;
      enhancePage = function(el) {
        if (el.parentNode) {
          return $(el).page("destroy").page();
        }
      };
      return Backbone.View.extend({
        initialize: function() {
          var old_render;
          old_render = this.render;
          return this.render = function() {
            var view;
            view = old_render.apply(this, arguments);
            enhancePage(view.el);
            return view;
          };
        }
      });
    })();
  });

}).call(this);
