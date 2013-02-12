(function() {

  define(['underscore', 'handlebars'], function(_, Handlebars) {
    var pad;
    Handlebars.registerHelper('sampleSize', function() {
      return _.reduce(this.answers, (function(sum, answer) {
        return sum + answer.counter;
      }), 0);
    });
    Handlebars.registerHelper('shorten', function(text) {
      if (text.length > 13) {
        return "" + text.slice(0, 11) + "[…]";
      } else {
        return text;
      }
    });
    pad = function(n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return n;
      }
    };
    Handlebars.registerHelper('date', function(n) {
      var d;
      d = new Date(n * 1000);
      return pad(d.getFullYear()) + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    });
    Handlebars.registerHelper('questions_path', function(action) {
      var path;
      path = action;
      if (!(action === 'index' || action === 'new')) {
        path += "/" + this.id;
      }
      return cliqr.config.PLUGIN_URL + ("questions/" + path + "?cid=") + cliqr.config.CID;
    });
    return Handlebars;
  });

}).call(this);
