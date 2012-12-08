(function() {
  var getTemplate;

  getTemplate = _.memoize(function(id) {
    return _.template($("script#template-" + id).html());
  });

  jQuery(function($) {
    var addNewChoice, answers, data, max, width, widths;
    addNewChoice = function(event) {
      var new_choice;
      new_choice = $(event.target).closest(".choices").find(".choice-new");
      return $(getTemplate("vote-form-choice")()).insertBefore(new_choice).find("input").focus();
    };
    $("form.vote-form").on("click", "a.close", function(event) {
      var choice_input;
      choice_input = $(event.target).closest(".choice-input");
      if (choice_input.siblings(".choice-input").length) {
        return choice_input.remove();
      } else {
        return choice_input.effect("shake", 50);
      }
    }).on("click", ".choice-new", function(event) {
      return addNewChoice(event);
    }).on("keydown", "input.choice", function(event) {
      var form_inputs, index, inputs, last;
      if (event.which === 13 || event.which === 38 || event.which === 40 || event.which === 9 && !event.shiftKey) {
        inputs = $(event.target).closest(".choices").find("input");
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
          form_inputs = $(event.target).closest("form").find("input");
          form_inputs.eq(form_inputs.index(event.target) - 1).focus();
          return event.preventDefault();
        }
      }
    }).on("submit", function(event) {
      var form;
      event.preventDefault();
      form = $(this);
      if (form.data("validator").checkValidity()) {
        return $.post(form.attr("action"), form.serialize()).done(function(msg) {
          return console.log("done", arguments);
        }).fail(function() {
          return console.log("fail", arguments);
        });
      }
    });
    if ($("#cliqr-index").length) {
      $("ol#questions").on("click", "button.delete", function(event) {
        if (!window.confirm("Wirklich loeschen?")) {
          return event.preventDefault();
        }
      });
      $("li.count").each(function() {
        return console.log(this);
      });
    }
    if ($("#cliqr-show").length) {
      width = 600;
      answers = $("table.results td");
      data = answers.map(function(index, el) {
        return parseInt($(el).attr("data-count"), 10);
      });
      max = _.max(data);
      widths = _.map(data, function(d) {
        if (max > 0) {
          return d / max * width;
        } else {
          return 0;
        }
      });
      return answers.append(function(index) {
        return $('<div class="chart"></div>').css({
          width: widths[index]
        });
      });
    }
  });

}).call(this);
