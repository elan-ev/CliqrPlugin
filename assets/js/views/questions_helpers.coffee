define [
  'underscore'
  'handlebars'
], (_, Handlebars) ->


  # {{sampleSize}} in question context sums up all answers
  Handlebars.registerHelper 'sampleSize', ->
    _.reduce @answers, ((sum, answer) -> sum + answer.counter), 0


  # {{shorten "text"}} shortens the text to 10 chars
  Handlebars.registerHelper 'shorten', (text) ->
    if text.length > 13 then "#{text[0..10]}[…]" else text


  # {{date int}} formats a Date to YYYY-MM-DD
  pad = (n) -> if n < 10 then '0' + n else n
  Handlebars.registerHelper 'date', (n) ->
    d = new Date n * 1000
    pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + pad(d.getFullYear())


  # {{questions_path args}} creates a link URL to questions/<action>
  Handlebars.registerHelper 'questions_path', (action) ->
    path = action
    unless action is 'index' or action is 'new'
      path += "/#{@id}"
    cliqr.config.PLUGIN_URL + "questions/#{path}?cid=" + cliqr.config.CID


  # {{#if_state arg}} is a block helper triggering on a certain state
  Handlebars.registerHelper 'if_state', (context, options) ->
    if @state is context
      options.fn @
    else
      options.inverse @


  # {{#unless_state arg}} is a block helper triggering unless on a certain state
  Handlebars.registerHelper 'unless_state', (context, options) ->
    [options.fn, options.inverse] = [options.inverse, options.fn]
    Handlebars.helpers['if_state'].call @, context, options

  Handlebars
