(function() {

  define(['underscore'], function(_) {
    /*
      TODO docs
    */

    var id_list;
    return id_list = (function() {
      var DECAY_TIME, KEY, fetch, removeStaleIDs, save, time;
      KEY = "cliqr.model.IDList";
      DECAY_TIME = 60 * 60 * 24;
      time = function() {
        return Math.floor(Date.now() / 1000);
      };
      fetch = function() {
        var _ref;
        return (_ref = JSON.parse(window.localStorage.getItem(KEY))) != null ? _ref : {};
      };
      save = function(ids) {
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
      removeStaleIDs = _.compose(save, removeStaleIDs, fetch);
      removeStaleIDs();
      return {
        add: function(id) {
          var ids;
          ids = fetch();
          ids[id] = time();
          save(ids);
          return this;
        },
        remove: function(id) {
          var ids;
          ids = fetch();
          delete ids[id];
          save(ids);
          return this;
        },
        test: function(id) {
          return fetch()[id] != null;
        }
      };
    })();
  });

}).call(this);
