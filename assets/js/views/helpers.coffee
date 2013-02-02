define [
], () ->

  # TODO reuse in polls.coffee
  # returns the nth uppercase roman literal
  nominal: do (A = "A".charCodeAt 0) ->
    (index) ->
      String.fromCharCode A + index % 26
