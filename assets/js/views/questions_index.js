var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['backbone', 'utils', 'underscore', 'views/questions_form', 'views/questions_helpers'], function(Backbone, utils, _, QuestionsForm, QuestionsListView, _helpers) {
  var QuestionsIndexView;
  return QuestionsIndexView = (function(_super) {

    __extends(QuestionsIndexView, _super);

    function QuestionsIndexView() {
      return QuestionsIndexView.__super__.constructor.apply(this, arguments);
    }

    QuestionsIndexView.prototype.className = "page";

    QuestionsIndexView.prototype.initialize = function() {
      return this;
    };

    QuestionsIndexView.prototype.render = function() {
      var q_active, q_new, q_stopped, tables, template, template_table;
      template = utils.compileTemplate('questions-index');
      template_table = utils.compileTemplate('questions-index-table');
      q_new = this.collection.where({
        state: "new"
      });
      q_active = this.collection.where({
        state: "active"
      });
      q_stopped = this.collection.where({
        state: "stopvis"
      });
      tables = {
        table_new: template_table({
          questions: _.invoke(q_new, "toJSON"),
          state: "new"
        }),
        table_active: template_table({
          questions: _.invoke(q_active, "toJSON"),
          state: "active"
        }),
        table_stopped: template_table({
          questions: _.invoke(q_stopped, "toJSON"),
          state: "stopped"
        })
      };
      this.$el.html(template(tables));
      return this;
    };

    QuestionsIndexView.prototype.postRender = function() {
      $("#questions-table.new").tablesorter();
      $("#questions-table.active").tablesorter();
      $("#questions-table.stopped").tablesorter();
      return this;
    };

    return QuestionsIndexView;

  })(Backbone.View);
});