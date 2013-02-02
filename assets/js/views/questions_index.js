(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'utils', 'views/questions_index', 'views/questions_sort_options', 'views/questions_form'], function(Backbone, utils, QuestionsIndexView, SortOptionsView, QuestionsForm) {
    return QuestionsIndexView = (function(_super) {

      __extends(QuestionsIndexView, _super);

      function QuestionsIndexView() {
        return QuestionsIndexView.__super__.constructor.apply(this, arguments);
      }

      QuestionsIndexView.prototype.events = {
        "click button.delete": "confirmDelete",
        "click a.questions-new": "showCreateForm"
      };

      QuestionsIndexView.prototype.initialize = function() {
        return this.sortOptions = new SortOptionsView({
          el: this.$("#stopped-questions")
        });
      };

      QuestionsIndexView.prototype.render = function() {
        return this;
      };

      QuestionsIndexView.prototype.confirmDelete = function(event) {
        if (!window.confirm("Wirklich l\xf6schen?")) {
          return event.preventDefault();
        }
      };

      QuestionsIndexView.prototype.showCreateForm = function(event) {
        var form;
        event.preventDefault();
        form = new QuestionsForm();
        return utils.changeToPage(form);
      };

      return QuestionsIndexView;

    })(Backbone.View);
  });

}).call(this);
