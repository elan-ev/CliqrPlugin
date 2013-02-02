(function() {

  define([], function() {
    return {
      nominal: (function(A) {
        return function(index) {
          return String.fromCharCode(A + index % 26);
        };
      })("A".charCodeAt(0))
    };
  });

}).call(this);
