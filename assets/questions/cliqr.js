(function() {
  var addNewChoice, compileTemplate, nominal,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  cliqr.model.Question = (function(_super) {

    __extends(Question, _super);

    function Question() {
      return Question.__super__.constructor.apply(this, arguments);
    }

    Question.prototype.url = function() {
      return cliqr.config.PLUGIN_URL + ("questions/show/" + (this.get('id')) + "?cid=") + cliqr.config.CID;
    };

    return Question;

  })(Backbone.Model);

  nominal = (function(A) {
    return function(index) {
      return String.fromCharCode(A + index % 26);
    };
  })("A".charCodeAt(0));

  compileTemplate = _.memoize(function(name) {
    return Mustache.compile($("#cliqr-template-" + name).html());
  });

  cliqr.ui.TemplateView = (function(_super) {

    __extends(TemplateView, _super);

    function TemplateView() {
      return TemplateView.__super__.constructor.apply(this, arguments);
    }

    TemplateView.prototype.template = function() {
      this.template = compileTemplate(this.template_id);
      return this.template.apply(this, arguments);
    };

    return TemplateView;

  })(Backbone.View);

  cliqr.ui.QuestionsIndexView = (function(_super) {

    __extends(QuestionsIndexView, _super);

    function QuestionsIndexView() {
      return QuestionsIndexView.__super__.constructor.apply(this, arguments);
    }

    QuestionsIndexView.prototype.el = '#cliqr-index';

    QuestionsIndexView.prototype.events = {
      "click button.delete": "confirmDelete",
      "click a.questions-new": "showCreateForm"
    };

    QuestionsIndexView.prototype.initialize = function() {
      return this.sortOptions = new cliqr.ui.SortOptionsView({
        el: this.$("#stopped-questions")
      });
    };

    QuestionsIndexView.prototype.confirmDelete = function(event) {
      if (!window.confirm("Wirklich l\xf6schen?")) {
        return event.preventDefault();
      }
    };

    QuestionsIndexView.prototype.showCreateForm = function(event) {
      var form;
      event.preventDefault();
      form = new cliqr.ui.QuestionForm();
      return this.$('.page').html(form.render().el);
    };

    return QuestionsIndexView;

  })(Backbone.View);

  cliqr.ui.SortOptionsView = (function(_super) {

    __extends(SortOptionsView, _super);

    function SortOptionsView() {
      this.sortBy = __bind(this.sortBy, this);
      return SortOptionsView.__super__.constructor.apply(this, arguments);
    }

    SortOptionsView.prototype.initialize = function() {
      this.ol = this.$("ol");
      return this.ol.isotope({
        itemSelector: 'li',
        getSortData: {
          question: function(elem) {
            return elem.attr('data-question').toLocaleLowerCase();
          },
          counter: function(elem) {
            return -parseInt(elem.attr('data-counter'), 10);
          },
          startdate: function(elem) {
            return parseInt(elem.attr('data-startdate'), 10);
          }
        }
      });
    };

    SortOptionsView.prototype.events = {
      "click .sort-by span": "sortBy"
    };

    SortOptionsView.prototype.sortBy = function(event) {
      var target;
      target = $(event.target);
      if (target.hasClass("selected")) {
        target.toggleClass("reversed");
      } else {
        this.$(".sort-by .selected").removeClass("selected reversed");
        target.addClass("selected");
      }
      return this.ol.isotope({
        sortBy: target.attr("data-attribute"),
        sortAscending: !target.hasClass("reversed")
      });
    };

    return SortOptionsView;

  })(Backbone.View);

  cliqr.ui.QuestionView = (function(_super) {

    __extends(QuestionView, _super);

    function QuestionView() {
      this.updateAnswers = __bind(this.updateAnswers, this);
      return QuestionView.__super__.constructor.apply(this, arguments);
    }

    QuestionView.prototype.el = '#cliqr-show';

    QuestionView.prototype.events = {
      "click .fullscreen": "showFS",
      "click .appeal.start button": "startQuestion"
    };

    QuestionView.prototype.showFS = function() {
      var container;
      container = this.$("#layout_page")[0];
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
      return false;
    };

    QuestionView.prototype.initialize = function() {
      this.resultsView = new cliqr.ui.ResultsView({
        model: this.model.toJSON().answers
      });
      return this.model.on("change:answers", this.updateAnswers);
    };

    QuestionView.prototype.render = function() {
      this.$(".question").append(this.resultsView.render().el);
      return this;
    };

    QuestionView.prototype.updateAnswers = function(model, answers, options) {
      return this.resultsView.update(answers);
    };

    QuestionView.prototype.startQuestion = function(event) {
      return this.$(".appeal.start").addClass("busy");
    };

    return QuestionView;

  })(Backbone.View);

  cliqr.ui.ResultsView = (function(_super) {

    __extends(ResultsView, _super);

    function ResultsView() {
      return ResultsView.__super__.constructor.apply(this, arguments);
    }

    ResultsView.prototype.template_id = 'questions-results';

    ResultsView.prototype.enhanceChart = function() {
      var counts, data, max, width, widths;
      this.$('.chart').remove();
      width = 300;
      counts = this.$(".results .count");
      data = _.pluck(this.model, "counter");
      max = _.max(data);
      widths = _.map(data, function(d) {
        if (max > 0) {
          return d / max * width;
        } else {
          return 0;
        }
      });
      return counts.before(function(index) {
        return $('<span class="chart"></div>').css({
          width: widths[index]
        }).attr({
          "data-count": data[index]
        });
      });
    };

    ResultsView.prototype.enrichedModel = function() {
      var answer, i, percent, sum, _i, _len, _ref, _results;
      sum = _.reduce(this.model, (function(memo, answer) {
        return memo + answer.counter;
      }), 0);
      _ref = this.model;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        answer = _ref[i];
        percent = sum === 0 ? 0 : Math.floor(100 * answer.counter / sum);
        _results.push(_.extend({}, answer, {
          nominal: nominal(i),
          percent: percent
        }));
      }
      return _results;
    };

    ResultsView.prototype.render = function() {
      this.$el.html(this.template({
        answers: this.enrichedModel()
      }));
      this.enhanceChart();
      return this;
    };

    ResultsView.prototype.update = function(answers) {
      this.model = answers;
      return this.render();
    };

    return ResultsView;

  })(cliqr.ui.TemplateView);

  addNewChoice = function(event) {
    var empty_question, new_choice, template;
    new_choice = $(event.target).closest(".choices").find(".choice-new");
    template = compileTemplate('questions-choice');
    empty_question = {
      answer_id: '',
      text: ''
    };
    return $(template(empty_question)).insertBefore(new_choice).find("input").focus();
  };

  cliqr.ui.QuestionForm = (function(_super) {

    __extends(QuestionForm, _super);

    function QuestionForm() {
      return QuestionForm.__super__.constructor.apply(this, arguments);
    }

    QuestionForm.prototype.template_id = 'questions-form';

    QuestionForm.prototype.events = {
      "click .choice-new": "addChoice",
      "click .close": "removeChoice",
      "keydown input.choice": "enhanceChoiceInput",
      "submit form": "submitForm"
    };

    QuestionForm.prototype.render = function() {
      Mustache.compilePartial('choice', $("#cliqr-template-questions-choice").html());
      this.$el.html(this.template(this.model ? this.model.toJSON() : {}));
      this.$("form").validator();
      return this;
    };

    QuestionForm.prototype.addChoice = function(event) {
      return addNewChoice(event);
    };

    QuestionForm.prototype.removeChoice = function(event) {
      var choice_input;
      choice_input = $(event.target).closest(".choice-input");
      if (choice_input.siblings(".choice-input").length) {
        return choice_input.remove();
      } else {
        return choice_input.effect("shake", 50);
      }
    };

    QuestionForm.prototype.enhanceChoiceInput = function(event) {
      var form_inputs, index, inputs, last;
      if (event.which === 13 || event.which === 38 || event.which === 40 || event.which === 9 && !event.shiftKey) {
        inputs = this.$(".choices input");
        last = inputs.length - 1;
        index = inputs.index(event.target);
        if (event.which === 9 && last === index) {
          event.preventDefault();
          addNewChoice(event);
        }
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

    QuestionForm.prototype.submitForm = function(event) {
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

    return QuestionForm;

  })(cliqr.ui.TemplateView);

}).call(this);
