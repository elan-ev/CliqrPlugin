define [
  'jquery'
], (jQuery) ->

  jQuery(document).bind "mobileinit", ->
    jQuery.mobile.ajaxEnabled = false
    jQuery.mobile.linkBindingEnabled = false
    jQuery.mobile.hashListeningEnabled = false
    jQuery.mobile.pushStateEnabled = false

  jQuery('div[data-role="page"]').live 'pagehide', (event, ui)->
    jQuery(event.currentTarget).remove()

  return
