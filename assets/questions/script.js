(function() {
  var getTemplate;

  getTemplate = _.memoize(function(id) {
    return _.template($("script#template-" + id).html());
  });

  jQuery(function($) {
    var addNewChoice;
    addNewChoice = function(event) {
      var new_choice;
      new_choice = $(event.target).closest(".choices").find(".choice-new");
      return $(getTemplate("vote-form-choice")()).insertBefore(new_choice).find("input").focus();
    };
    return $("form.vote-form").on("click", "a.close", function(event) {
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
          form_inputs = $(event.target).closest(".choices").find("input");
          index = Math.max(0, form_inputs.index(event.target) - 1);
          form_inputs.eq(index).focus();
          return event.preventDefault();
        }
      }
    }).on("submit", function(event) {
      var form, url;
      event.preventDefault();
      form = $(this);
      if (form.data("validator").checkValidity()) {
        url = form.attr("action");
        return $.ajax({
          type: "POST",
          url: url,
          data: form.serialize(),
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        }).done(function(msg) {
          var re;
          re = /(?!questions\/)(create|update\/[a-fA-F0-9]{32})/;
          return document.location = url.replace(re, "show/" + msg.id);
        }).fail(function() {
          return console.log("TODO fail", arguments);
        });
      }
    });
  });

}).call(this);
