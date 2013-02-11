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


  pad = (n) -> if n < 10 then '0' + n else n

  # {{date int}} formats a Date to YYYY-MM-DD
  Handlebars.registerHelper 'date', (n) ->
    d = new Date n * 1000
    pad(d.getFullYear()) + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate())

  Handlebars
