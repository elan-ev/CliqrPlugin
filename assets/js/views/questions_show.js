(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'utils', 'models/question', 'views/questions_results_view'], function(Backbone, utils, Question, ResultsView) {
    var QuestionView;
    return QuestionView = (function(_super) {

      __extends(QuestionView, _super);

      function QuestionView() {
        this.updateState = __bind(this.updateState, this);

        this.updateAnswers = __bind(this.updateAnswers, this);
        return QuestionView.__super__.constructor.apply(this, arguments);
      }

      QuestionView.prototype.events = {
        "click .appeal.start button": "startQuestion",
        "click a.qr": "showQRCode",
        "submit form.questions-destroy": "confirmDestroy"
      };

      /*
          showFS: ->
            container = @$("#layout_page")[0]
            if container.requestFullscreen
              container.requestFullscreen()
            else if container.mozRequestFullScreen
              container.mozRequestFullScreen()
            else if container.webkitRequestFullscreen
              container.webkitRequestFullscreen()
            false
      */


      QuestionView.prototype.initialize = function() {
        this.resultsView = new ResultsView({
          model: this.model.toJSON().answers
        });
        this.listenTo(this.model, "change:answers", this.updateAnswers);
        return this.listenTo(this.model, "change:state", this.updateState);
      };

      QuestionView.prototype.render = function() {
        this.$(".question").append(this.resultsView.render().el);
        return this;
      };

      QuestionView.prototype.updateAnswers = function(model, answers, options) {
        return this.resultsView.update(answers);
      };

      QuestionView.prototype.updateState = function(model, state, options) {
        return document.location.reload();
      };

      QuestionView.prototype.startQuestion = function(event) {
        return this.$(".appeal.start").addClass("busy");
      };

      QuestionView.prototype.showQRCode = function(event) {
        event.preventDefault();
        return this.$(".question").toggleClass("qr-visible");
      };

      QuestionView.prototype.confirmDestroy = function(event) {
        if (!window.confirm($(event.target).data("confirm"))) {
          return event.preventDefault();
        }
      };

      return QuestionView;

    })(Backbone.View);
  });

}).call(this);
