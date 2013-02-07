(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'utils', 'handlebars', 'views/template_view'], function(Backbone, utils, Handlebars, TemplateView) {
    var QuestionsForm, addNewChoice;
    addNewChoice = function(event) {
      var empty_question, new_choice, template;
      new_choice = $(event.target).closest(".choices").find(".choice-new");
      template = utils.compileTemplate('questions-choice');
      empty_question = {
        answer_id: '',
        text: ''
      };
      return $(template(empty_question)).insertBefore(new_choice).find("input").focus();
    };
    return QuestionsForm = (function(_super) {

      __extends(QuestionsForm, _super);

      function QuestionsForm() {
        return QuestionsForm.__super__.constructor.apply(this, arguments);
      }

      QuestionsForm.prototype.template_id = 'questions-form';

      QuestionsForm.prototype.className = "page";

      QuestionsForm.prototype.events = {
        "click .choice-new": "addChoice",
        "click .close": "removeChoice",
        "keydown input.choice": "enhanceChoiceInput",
        "submit form": "submitForm",
        "click [name=cancel]": "cancelForm"
      };

      QuestionsForm.prototype.render = function() {
        Handlebars.registerPartial('choice', $("#cliqr-template-questions-choice").html());
        this.$el.html(this.template(this.model ? this.model.toJSON() : {}));
        this.$("form").validator();
        return this;
      };

      QuestionsForm.prototype.addChoice = function(event) {
        return addNewChoice(event);
      };

      QuestionsForm.prototype.removeChoice = function(event) {
        var choice_input;
        choice_input = $(event.target).closest(".choice-input");
        if (choice_input.siblings(".choice-input").length) {
          return choice_input.remove();
        } else {
          return choice_input.effect("shake", 50);
        }
      };

      QuestionsForm.prototype.enhanceChoiceInput = function(event) {
        var form_inputs, index, inputs, last;
        if (event.which === 13 || event.which === 38 || event.which === 40) {
          inputs = this.$(".choices input");
          last = inputs.length - 1;
          index = inputs.index(event.target);
          if (event.which === 13 || event.which === 40) {
            if (last === index) {
              addNewChoice(event);
            } else {
              inputs[index + 1].focus();
            }
            event.preventDefault();
          }
          if (event.which === 38) {
            form_inputs = this.$(".choices input");
            index = Math.max(0, form_inputs.index(event.target) - 1);
            form_inputs.eq(index).focus();
            return event.preventDefault();
          }
        }
      };

      QuestionsForm.prototype.submitForm = function(event) {
        var form, url;
        event.preventDefault();
        form = this.$("form");
        if (!form.data("validator").checkValidity()) {
          return;
        }
        url = "questions/" + (this.model ? "update/" + this.model.id : "create");
        return $.post("" + cliqr.config.PLUGIN_URL + url + "?cid=" + cliqr.config.CID, form.serialize()).done(function(msg) {
          return document.location = cliqr.config.PLUGIN_URL + ("questions/show/" + msg.id + "?cid=") + cliqr.config.CID;
        }).fail(function() {
          return console.log("TODO fail", arguments);
        });
      };

      QuestionsForm.prototype.cancelForm = function(event) {
        event.preventDefault();
        return utils.changeToPreviousPage();
      };

      return QuestionsForm;

    })(TemplateView);
  });

}).call(this);
