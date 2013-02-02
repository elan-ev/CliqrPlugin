(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'utils'], function(Backbone, utils) {
    var TemplateView;
    return TemplateView = (function(_super) {

      __extends(TemplateView, _super);

      function TemplateView() {
        return TemplateView.__super__.constructor.apply(this, arguments);
      }

      TemplateView.prototype.template = function() {
        this.template = utils.compileTemplate(this.template_id);
        return this.template.apply(this, arguments);
      };

      return TemplateView;

    })(Backbone.View);
  });

}).call(this);
