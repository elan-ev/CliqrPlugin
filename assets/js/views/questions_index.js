(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'utils', 'underscore', 'views/questions_form', 'views/questions_list', 'views/questions_helpers'], function(Backbone, utils, _, QuestionsForm, QuestionsListView, _helpers) {
    var QuestionsIndexView;
    return QuestionsIndexView = (function(_super) {

      __extends(QuestionsIndexView, _super);

      function QuestionsIndexView() {
        return QuestionsIndexView.__super__.constructor.apply(this, arguments);
      }

      QuestionsIndexView.prototype.className = "page";

      QuestionsIndexView.prototype.events = {
        "click button.delete": "confirmDelete"
      };

      QuestionsIndexView.prototype.initialize = function() {
        return this.listViews = {
          'new': new QuestionsListView({
            collection: this.collection,
            state: 'new'
          }),
          'active': new QuestionsListView({
            collection: this.collection,
            state: 'active'
          }),
          'stopped': new QuestionsListView({
            collection: this.collection,
            state: 'stopvis',
            sortable: true
          })
        };
      };

      QuestionsIndexView.prototype.render = function() {
        var key, template, view, _ref;
        template = utils.compileTemplate('questions-index');
        this.$el.html(template());
        _ref = this.listViews;
        for (key in _ref) {
          view = _ref[key];
          this.$('#' + key + '-questions').replaceWith(view.render().el);
        }
        return this;
      };

      QuestionsIndexView.prototype.confirmDelete = function(event) {
        if (!window.confirm("Wirklich l\xf6schen?")) {
          return event.preventDefault();
        }
      };

      return QuestionsIndexView;

    })(Backbone.View);
  });

}).call(this);
