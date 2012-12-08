(function() {

  $(document).bind("mobileinit", function() {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $('div[data-role="page"]').live('pagehide', function(event, ui) {
      return $(event.currentTarget).remove();
    });
  });

}).call(this);
