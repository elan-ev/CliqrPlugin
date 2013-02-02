(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var SortOptionsView;
    return SortOptionsView = (function(_super) {

      __extends(SortOptionsView, _super);

      function SortOptionsView() {
        this.sortBy = __bind(this.sortBy, this);
        return SortOptionsView.__super__.constructor.apply(this, arguments);
      }

      SortOptionsView.prototype.initialize = function() {
        this.ol = this.$("ol");
        return this.ol.isotope({
          itemSelector: 'li',
          getSortData: {
            question: function(elem) {
              return elem.attr('data-question').toLocaleLowerCase();
            },
            counter: function(elem) {
              return -parseInt(elem.attr('data-counter'), 10);
            },
            startdate: function(elem) {
              return parseInt(elem.attr('data-startdate'), 10);
            }
          }
        });
      };

      SortOptionsView.prototype.events = {
        "click .sort-by span": "sortBy"
      };

      SortOptionsView.prototype.sortBy = function(event) {
        var target;
        target = $(event.target);
        if (target.hasClass("selected")) {
          target.toggleClass("reversed");
        } else {
          this.$(".sort-by .selected").removeClass("selected reversed");
          target.addClass("selected");
        }
        return this.ol.isotope({
          sortBy: target.attr("data-attribute"),
          sortAscending: !target.hasClass("reversed")
        });
      };

      return SortOptionsView;

    })(Backbone.View);
  });

}).call(this);
