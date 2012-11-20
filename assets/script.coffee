# (function ($) {
#     /*
#     $(document).ready(function() {
#         var resultsContainer = $("#cliqr_vote_results");
#         if(resultsContainer.size() > 0) {
#             // load vote results every 10 seconds
#             var resultsUrl = location.pathname.replace(/show/, "results") +
#                 location.search;
#             refreshContainer(resultsContainer, resultsUrl, 10000);
#         }
#     });
#
#     // replace the contents of a container every timeout miliseconds with the
#     // response when the given url is requested
#     function refreshContainer(container, url, timeout) {
#         $.get(url, "", function(data) {
#             container.html(data);
#         });
#         window.setTimeout(function() {
#             refreshContainer(container, url, timeout);
#         }, timeout);
#     }
#      */
# }(jQuery));

getTemplate = _.memoize (id) ->
  _.template $("script#template-#{id}").html()

jQuery ($) ->

  # vote form
  $("form.vote-form")
    .on "click", "a.close", (event) ->
      $(event.target).parent(".choice-input").remove()
    .on "click", ".choice-new", (event) ->
      $(event.target).before(getTemplate("vote-form-choice")())
    .on "submit", (event) ->
      event.preventDefault()

      form = $ @
      if form.data("validator").checkValidity()
        $.post(form.attr("action"), form.serialize())
          .done () ->
            console.log "done", arguments
          .fail () ->
            console.log "fail", arguments


  # charts
  if $("#cliqr-show").length
    width   = 600
    answers = $ "table.results td"
    data    = answers.map (index, el) -> parseInt $(el).attr("data-count"), 10
    max     = _.max data
    widths  = _.map data, (d) -> if max > 0 then d / max * width else 0

    answers.append (index) ->
      $('<div class="chart"></div>').css width: widths[index]
