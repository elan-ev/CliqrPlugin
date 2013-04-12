define [
  'backbone'
  'utils'
  'underscore'
], (Backbone, utils, _) ->

  class QuestionsIndexView extends Backbone.View
    className: "page"

    id: "questions-index"

    events:
      "submit form":         "submitFilter"
      "keyup  input.search": "filterList"
      "change input.search": "filterList"
      "input  input.search": "filterList"

    groupCollection: ->
      groups = @collection.groupByDate()

      grouped = []
      for date in _.keys(groups).reverse()
        grouped.push {divider: true, startdate: if date is "null" then null else date}
        for question in groups[date].reverse()
          grouped.push question.toJSON()

      grouped


    render: ->
      template = utils.compileTemplate 'questions-index'
      @$el.html template { grouped: @groupCollection() }
      @


    defaultFilterCallback = (text, searchValue, item) ->
      text.toString().toLowerCase().indexOf( searchValue ) == -1

    lastval = ""

    filterList: (e) ->
      search = @$ "input.search"
      val = search[0].value.toLowerCase()
      listItems = null
      list = @$ "ol"
      childItems = false
      itemtext = ""

      return if lastval is val

      if val.length < lastval.length || val.indexOf(lastval) != 0
        # removed chars or pasted something totally different, check all items
        listItems = list.children()

      else
        # Only chars added, not removed, only use visible subset
        listItems = list.children ":not(.ui-screen-hidden)"

      # Change val as lastval for next execution
      lastval = val


      if val

        # This handles hiding regular rows without the text we search for
        # and any list dividers without regular rows shown under it

        for i in [listItems.length-1..0] by -1
          item = jQuery listItems[i]
          itemtext = item.text()

          if item.hasClass "divider"
            item.toggleClass "ui-filter-hidequeue", !childItems
            # New bucket!
            childItems = false

          else if defaultFilterCallback itemtext, val, item

            # mark to be hidden
            item.toggleClass "ui-filter-hidequeue", true

          else
            # There's a shown item in the bucket
            childItems = true

        # Show items, not marked to be hidden
        listItems.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden", false)

        # Hide items, marked to be hidden
        listItems.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden", true).toggleClass("ui-filter-hidequeue", false)

      else
        # filtervalue is empty => show all
        listItems.toggleClass "ui-screen-hidden", false

    submitFilter: ->
      @$("input.search").blur()
      false
