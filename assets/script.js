(function() {
  var getTemplate;

  getTemplate = _.memoize(function(id) {
    return _.template($("script#template-" + id).html());
  });

  jQuery(function($) {
    var answers, data, max, width, widths;
    $("form.vote-form").on("click", "a.close", function(event) {
      return $(event.target).parent(".choice-input").remove();
    }).on("click", ".choice-new", function(event) {
      return $(event.target).before(getTemplate("vote-form-choice")());
    }).on("submit", function(event) {
      var form;
      event.preventDefault();
      form = $(this);
      if (form.data("validator").checkValidity()) {
        return $.post(form.attr("action"), form.serialize()).done(function() {
          return console.log("done", arguments);
        }).fail(function() {
          return console.log("fail", arguments);
        });
      }
    });
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
