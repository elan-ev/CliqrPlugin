
/*
Provide top-level namespaces for our javascript.
*/


(function() {
  var compileTemplate, nominal,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.cliqr || (window.cliqr = {
    config: {},
    model: {},
    router: {},
    ui: {}
  });

  /*
  Initialize the router and start Backbone hash listening magic
  */


  $(document).ready(function() {
    /*
      As the webpage contains the initial polls, pre-populate the global
      $Polls (the initial $ indicates a global variable) with these. This
      way we spare us an initial AJAX call.
    */
    cliqr.$Polls = new cliqr.model.PollCollection(cliqr.config.POLLS || []);
    /*
      Declare the global $App object (the initial $ indicates a global
      variable). We need it to dynamically navigate between routes etc.
    */

    cliqr.$App = new cliqr.router.AppRouter();
    Backbone.history.start();
  });

  /*
  We use Mustache as template engine. This function makes it a lot
  easier to get a pre-compiled Mustache template.
  */


  compileTemplate = _.memoize(function(name) {
    return Mustache.compile($("#cliqr-template-" + name).html());
  });

  /*
  TODO: docu für pollview
  */


  cliqr.ui.PageView = (function() {
    var enhancePage;
    enhancePage = function(el) {
      if (el.parentNode) {
        return $(el).page("destroy").page();
      }
    };
    return Backbone.View.extend({
      initialize: function() {
        var old_render;
        old_render = this.render;
        return this.render = function() {
          var view;
          view = old_render.apply(this, arguments);
          enhancePage(view.el);
          return view;
        };
      }
    });
  })();

  /*
  TODO: docu für nominal
  */


  nominal = (function(A) {
    return function(index) {
      return String.fromCharCode(A + index % 26);
    };
  })("A".charCodeAt(0));

  /*
  TODO: docu für pollview
  */


  cliqr.ui.PollView = (function(_super) {

    __extends(PollView, _super);

    function PollView() {
      this.recordAnswer = __bind(this.recordAnswer, this);
      return PollView.__super__.constructor.apply(this, arguments);
    }

    PollView.prototype.template = compileTemplate("poll");

    PollView.prototype.events = {
      "submit form": "recordAnswer"
    };

    PollView.prototype.render = function() {
      var answer, index, poll, _i, _len, _ref;
      poll = this.collection.firstFresh();
      if (poll) {
        _ref = poll.get('answers');
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          answer = _ref[index];
          answer.nominal = nominal(index);
        }
      }
      this.$el.html(this.template({
        poll: poll != null ? poll.toJSON() : void 0
      }));
      return this;
    };

    PollView.prototype.recordAnswer = function(event) {
      var id,
        _this = this;
      event.preventDefault();
      id = this.$("input[name=vote_id]", event.target).val();
      if (cliqr.model.id_list.test(id)) {
        return alert("ha!");
      } else {
        return $.post(cliqr.$Polls.url(), this.$("form").serialize()).always(function() {
          cliqr.model.id_list.add(id);
          return console.log("always", arguments, id);
        }).done(function(msg) {
          return _this.render();
        }).fail(function(jqXHR, textStatus) {});
      }
    };

    return PollView;

  })(cliqr.ui.PageView);

  /*
  TODO: docs für Poll
  */


  cliqr.model.Poll = Backbone.Model.extend({
    initialize: function() {
      return console.log("initialized a Poll", arguments);
    }
  });

  /*
  TODO: docs für PollCollection
  */


  cliqr.model.PollCollection = Backbone.Collection.extend({
    model: cliqr.model.Poll,
    initialize: function() {
      return console.log("initialized a PollCollection", arguments);
    },
    url: function() {
      return cliqr.config.PLUGIN_URL + "poll/" + cliqr.config.RANGE_ID;
    },
    comparator: function(poll) {
      return poll.get('startdate');
    },
    firstFresh: function() {
      return this.find(function(model) {
        return !cliqr.model.id_list.test(model.id);
      });
    }
  });

  /*
  TODO docs
  */


  cliqr.model.id_list = (function() {
    var DECAY_TIME, KEY, fetch, fetchClean, ids, removeStaleIDs, save, time;
    KEY = "cliqr.model.IDList";
    DECAY_TIME = 15;
    time = function() {
      return Math.floor(Date.now() / 1000);
    };
    fetch = function() {
      var _ref;
      console.log("fetch");
      return (_ref = JSON.parse(window.localStorage.getItem(KEY))) != null ? _ref : {};
    };
    save = function(ids) {
      console.log("saved: ", JSON.stringify(ids));
      window.localStorage.setItem(KEY, JSON.stringify(ids));
      return ids;
    };
    removeStaleIDs = function(old_ids) {
      var best_before, id, ids, timestamp;
      best_before = time() - DECAY_TIME;
      ids = {};
      for (id in old_ids) {
        timestamp = old_ids[id];
        if (timestamp >= best_before) {
          ids[id] = timestamp;
        }
      }
      return ids;
    };
    fetchClean = _.compose(save, removeStaleIDs, fetch);
    ids = fetchClean();
    $(window).on("storage", function() {
      return ids = fetch();
    });
    return {
      add: function(id) {
        console.log("add: ", JSON.stringify(id));
        ids[id] = time();
        console.log(ids);
        save(ids);
        return this;
      },
      remove: function(id) {
        unset(ids[id]);
        save(ids);
        return this;
      },
      test: function(id) {
        return ids[id] != null;
      }
    };
  })();

  /*
  Customized Backbone.Router playing nicely with jqm
  */


  cliqr.router.PageRouter = Backbone.Router.extend({
    initialize: function() {
      return this.firstPage = true;
    },
    /*
      Internal function to be used by the route handlers.
    
      `page` is a Backbone.View which is added as a jQuery mobile page to
      the pageContainer. Eventually, after all the setup mojo and
      everything is in place, the `jQuery mobile way`(TM) of changing
      pages is invoked.
    */

    changePage: function(page) {
      /*
          add "data-role=page" to the element of the page, then render and insert into the body
      */

      var transition;
      $(page.el).attr('data-role', 'page');
      page.render();
      $('body').append($(page.el));
      /*
          do not use transition for first page
      */

      transition = $.mobile.defaultPageTransition;
      if (this.firstPage) {
        transition = 'none';
        this.firstPage = false;
      }
      /*
          call the jqm function
      */

      return $.mobile.changePage($(page.el), {
        changeHash: false,
        transition: transition
      });
    }
  });

  /*
  The singleton AppRouter containing the handlers for all the routes.
  */


  cliqr.router.AppRouter = cliqr.router.PageRouter.extend({
    routes: {
      "": "showPoll"
    },
    showPoll: function() {
      return this.changePage(new cliqr.ui.PollView({
        collection: cliqr.$Polls
      }));
    }
  });

}).call(this);
