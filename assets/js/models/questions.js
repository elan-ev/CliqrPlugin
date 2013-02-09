(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'models/question'], function(Backbone, Question) {
    /*
      TODO: docs
    */

    var QuestionCollection;
    return QuestionCollection = (function(_super) {

      __extends(QuestionCollection, _super);

      function QuestionCollection() {
        return QuestionCollection.__super__.constructor.apply(this, arguments);
      }

      QuestionCollection.prototype.model = Question;

      QuestionCollection.prototype.comparator = function(question) {
        return question.get('startdate');
      };

      return QuestionCollection;

    })(Backbone.Collection);
  });

}).call(this);
