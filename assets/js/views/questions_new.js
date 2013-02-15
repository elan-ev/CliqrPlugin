(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['views/template_view', 'views/questions_form'], function(TemplateView, QuestionsForm) {
    var QuestionsNewView;
    return QuestionsNewView = (function(_super) {

      __extends(QuestionsNewView, _super);

      function QuestionsNewView() {
        return QuestionsNewView.__super__.constructor.apply(this, arguments);
      }

      QuestionsNewView.prototype.template_id = 'questions-new';

      QuestionsNewView.prototype.className = "page";

      QuestionsNewView.prototype.initialize = function() {
        return this.form = new QuestionsForm;
      };

      QuestionsNewView.prototype.render = function() {
        this.$el.html(this.template());
        this.$el.append(this.form.render().el);
        return this;
      };

      return QuestionsNewView;

    })(TemplateView);
  });

}).call(this);
