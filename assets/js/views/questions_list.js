(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['views/template_view', 'views/questions_sort_options'], function(TemplateView, SortOptionsView) {
    var QuestionsListView;
    return QuestionsListView = (function(_super) {

      __extends(QuestionsListView, _super);

      function QuestionsListView() {
        return QuestionsListView.__super__.constructor.apply(this, arguments);
      }

      QuestionsListView.prototype.template_id = 'questions-index-list';

      QuestionsListView.prototype.className = 'questions';

      QuestionsListView.prototype.initialize = function(options) {
        this.state = options.state;
        if (options.sortable) {
          return this.sortOptions = new SortOptionsView({
            list: this.$el
          });
        }
      };

      QuestionsListView.prototype.render = function() {
        var context, filtered;
        filtered = this.collection.where({
          state: this.state
        });
        context = {
          questions: _.invoke(filtered, "toJSON")
        };
        this.$el.html(this.template(context));
        this.$el.addClass("state-" + this.state);
        if (this.sortOptions && filtered.length) {
          this.$el.prepend(this.sortOptions.render().el);
        }
        return this;
      };

      return QuestionsListView;

    })(TemplateView);
  });

}).call(this);
