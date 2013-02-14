define [
  'views/template_view'
], (TemplateView) ->

  class SortOptionsView extends TemplateView
    template_id: 'questions-sort-options'

    events:
      "click .sort-by li": "sortBy"

    initialize: (options) ->
      @list = options.list

      # TODO Ob das so eine gute Idee ist?
      @listenTo Backbone, "page-after-show", @onShow

    getList: ->
      @list.find('ol').first()

    render: ->
      @$el.html @template()
      @

    onShow: ->
      @getList().isotope
        animationEngine: 'jquery'
        itemSelector: 'li'
        getSortData:
          question:   (elem) -> elem.attr('data-question').toLocaleLowerCase()
          counter:    (elem) -> - parseInt elem.attr('data-counter'), 10
          startdate:  (elem) -> parseInt elem.attr('data-startdate'), 10

    sortBy: (event) =>

      target = $ event.target

      if target.hasClass "selected"
        target.toggleClass "reversed"
      else
        @$(".sort-by .selected").removeClass("selected reversed")
        target.addClass "selected"

      @getList().isotope
        sortBy: target.attr("data-attribute")
        sortAscending: ! target.hasClass "reversed"
