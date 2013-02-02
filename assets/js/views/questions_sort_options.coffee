define [
  'backbone'
], (Backbone) ->

  class SortOptionsView extends Backbone.View
    initialize: ->
      @ol = @$ "ol"
      @ol.isotope
        itemSelector: 'li'
        getSortData:
          question:   (elem) -> elem.attr('data-question').toLocaleLowerCase()
          counter:    (elem) -> - parseInt elem.attr('data-counter'), 10
          startdate:  (elem) -> parseInt elem.attr('data-startdate'), 10

    events:
      "click .sort-by span": "sortBy"

    sortBy: (event) =>
      target = $ event.target

      if target.hasClass "selected"
        target.toggleClass "reversed"
      else
        @$(".sort-by .selected").removeClass("selected reversed")
        target.addClass "selected"

      @ol.isotope
        sortBy: target.attr("data-attribute")
        sortAscending: ! target.hasClass "reversed"
