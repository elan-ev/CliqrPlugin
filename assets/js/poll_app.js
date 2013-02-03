(function() {

  define(['jqm', 'models/poll_collection', 'models/back_pusher', 'routers/poll'], function(jqm, PollCollection, BackPusher, PollRouter) {
    var PollApp;
    return PollApp = (function() {

      function PollApp() {}

      PollApp.prototype.initialize = function() {
        this.prepopulatePolls();
        this.connectPusher();
        this.initRouter();
        return Backbone.history.start();
      };

      /*
          As the webpage contains the initial polls, pre-populate the global
          $Polls (the initial $ indicates a global variable) with these. This
          way we spare us an initial AJAX call.
      */


      PollApp.prototype.prepopulatePolls = function() {
        return cliqr.$Polls = new PollCollection(cliqr.config.POLLS || []);
      };

      /*
          connect it to Pusher
          TODO vllt ein bisschen auslagern
      */


      PollApp.prototype.connectPusher = function() {
        var bp, channel, pusher;
        pusher = new Pusher(cliqr.config.PUSHER_APP_KEY);
        channel = pusher.subscribe(cliqr.config.PUSHER_CHANNEL);
        bp = new BackPusher(channel);
        return bp.pushTo(cliqr.$Polls);
      };

      /*
          Declare the global $App object (the initial $ indicates a global
          variable). We need it to dynamically navigate between routes etc.
      */


      PollApp.prototype.initRouter = function() {
        return cliqr.$App = new PollRouter();
      };

      return PollApp;

    })();
  });

}).call(this);
