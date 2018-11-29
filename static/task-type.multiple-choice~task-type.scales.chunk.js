(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["task-type.multiple-choice~task-type.scales"],{

/***/ "../../node_modules/css-loader/lib/css-base.js":
/*!***********************************************************************************************!*\
  !*** /home/mlunzena/Sync/Projects/github/CliqrPlugin/node_modules/css-loader/lib/css-base.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "../hbs/component-task-edit.hbs":
/*!**************************************!*\
  !*** ../hbs/component-task-edit.hbs ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Handlebars = __webpack_require__(/*! /home/mlunzena/Sync/Projects/github/CliqrPlugin/node_modules/handlebars/runtime.js */ "../../node_modules/handlebars/runtime.js");
module.exports = (Handlebars['default'] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "    "
    + alias3((helpers.button || (depth0 && depth0.button) || alias2).call(alias1,"edit","Bearbeiten",{"name":"button","hash":{"icon":"edit"},"data":data}))
    + "\n    "
    + alias3((helpers.fab || (depth0 && depth0.fab) || alias2).call(alias1,"edit","Bearbeiten","edit",{"name":"fab","hash":{},"data":data}))
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "    "
    + alias3((helpers.button || (depth0 && depth0.button) || alias2).call(alias1,"copy-edit","Bearbeiten",{"name":"button","hash":{"color":"red","icon":"exclaim-circle"},"data":data}))
    + "\n    "
    + alias3((helpers.fab || (depth0 && depth0.fab) || alias2).call(alias1,"copy-edit","Bearbeiten","edit",{"name":"fab","hash":{"color":"red"},"data":data}))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.editable : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

/***/ }),

/***/ "./dialog.js":
/*!*******************!*\
  !*** ./dialog.js ***!
  \*******************/
/*! exports provided: showConfirmDialog, showDialog */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showConfirmDialog", function() { return showConfirmDialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showDialog", function() { return showDialog; });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "../../node_modules/backbone/backbone.js");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ "../../node_modules/underscore/underscore.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var showConfirmDialog = function showConfirmDialog(question, yes) {
  var no = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  window.STUDIP.Dialog.confirm(question, yes, no);
};

var showDialog = function showDialog(backboneView, dialogOptions) {
  return new Promise(function (resolve, reject) {
    var hygenicDialogClass = underscore__WEBPACK_IMPORTED_MODULE_1___default.a.uniqueId('cliqr--dialog-');

    backbone__WEBPACK_IMPORTED_MODULE_0___default.a.$(document).on("dialog-update.".concat(hygenicDialogClass), function (event, data) {
      if (data.dialog.closest('.ui-dialog').hasClass(hygenicDialogClass)) {
        data.dialog.append(backboneView.$el).dialog('open');
        resolve(function () {
          return data.dialog.dialog('close');
        });
      }
    });
    backbone__WEBPACK_IMPORTED_MODULE_0___default.a.$(document).on("dialogcreate.".concat(hygenicDialogClass), ".".concat(hygenicDialogClass), function (event, data) {
      backbone__WEBPACK_IMPORTED_MODULE_0___default.a.$(event.target).dialog('option', 'autoOpen', false);
    });
    backbone__WEBPACK_IMPORTED_MODULE_0___default.a.$(document).on("dialogclose.".concat(hygenicDialogClass), ".".concat(hygenicDialogClass), function (event) {
      if (backbone__WEBPACK_IMPORTED_MODULE_0___default.a.$(this).hasClass(hygenicDialogClass)) {
        backboneView.remove();
        backbone__WEBPACK_IMPORTED_MODULE_0___default.a.$(document).off(".".concat(hygenicDialogClass));
      }
    });
    window.STUDIP.Dialog.show('', _objectSpread({
      buttons: null,
      id: hygenicDialogClass
    }, dialogOptions, {
      dialogClass: "cliqr--dialog ".concat(hygenicDialogClass)
    }));
  });
};



/***/ }),

/***/ "./models/response.js":
/*!****************************!*\
  !*** ./models/response.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "../../node_modules/backbone/backbone.js");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ "../../node_modules/underscore/underscore.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__);


var actionMap = {
  create: 'create',
  update: 'update',
  delete: 'destroy',
  read: 'show'
};
var Response = backbone__WEBPACK_IMPORTED_MODULE_0___default.a.Model.extend({
  sync: function sync(method, model, options) {
    underscore__WEBPACK_IMPORTED_MODULE_1___default.a.extend(options, {
      url: typeof model.url === 'function' ? model.url(actionMap[method]) : void 0
    });

    return backbone__WEBPACK_IMPORTED_MODULE_0___default.a.sync(method, model, options);
  },
  url: function url(action) {
    var id = this.id != null ? '/' + this.id : '';
    return cliqr.config.PLUGIN_URL + 'responses/' + action + id + '?cancel_login=1';
  }
});
/* harmony default export */ __webpack_exports__["default"] = (Response);

/***/ }),

/***/ "./views/component-task-edit.js":
/*!**************************************!*\
  !*** ./views/component-task-edit.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "../../node_modules/backbone/backbone.js");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _viewmaster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./viewmaster */ "./views/viewmaster.js");
/* harmony import */ var _dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dialog */ "./dialog.js");
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../error */ "./error.js");




var TaskEditComponent = _viewmaster__WEBPACK_IMPORTED_MODULE_1__["default"].extend({
  tagName: 'span',
  className: 'cliqr--component-task-edit',
  template: __webpack_require__(/*! ../../hbs/component-task-edit.hbs */ "../hbs/component-task-edit.hbs"),
  events: {
    'click .js-edit': 'onClickEdit',
    'click .js-copy-edit': 'onClickCopyEdit'
  },
  initialize: function initialize(options) {
    _viewmaster__WEBPACK_IMPORTED_MODULE_1__["default"].prototype.initialize.call(this);
    console.log("options:", options);
  },
  context: function context() {
    var task = this.model.toJSON();
    var editable = !this.model.getVotings().any(function (v) {
      return v.get('responses_count');
    });
    return {
      task: task,
      editable: editable
    };
  },
  onClickEdit: function onClickEdit() {
    backbone__WEBPACK_IMPORTED_MODULE_0___default.a.history.navigate("task/edit/".concat(this.model.id), {
      trigger: true
    });
  },
  onClickCopyEdit: function onClickCopyEdit() {
    var _this = this;

    Object(_dialog__WEBPACK_IMPORTED_MODULE_2__["showConfirmDialog"])('Diese Frage kann nicht mehr geändert werden, da sie schon beantwortet wurde.\nWollen Sie eine Kopie dieser Frage erstellen und bearbeiten?', function () {
      _this.model.duplicate().then(function (task) {
        backbone__WEBPACK_IMPORTED_MODULE_0___default.a.history.navigate("task/edit/".concat(task.id), {
          trigger: true
        });
        return null;
      }).catch(function (error) {
        Object(_error__WEBPACK_IMPORTED_MODULE_3__["default"])('Error while copying task', error);
      });
    });
  }
});
/* harmony default export */ __webpack_exports__["default"] = (TaskEditComponent);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vL2hvbWUvbWx1bnplbmEvU3luYy9Qcm9qZWN0cy9naXRodWIvQ2xpcXJQbHVnaW4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uLi9oYnMvY29tcG9uZW50LXRhc2stZWRpdC5oYnMiLCJ3ZWJwYWNrOi8vLy4vZGlhbG9nLmpzIiwid2VicGFjazovLy8uL21vZGVscy9yZXNwb25zZS5qcyIsIndlYnBhY2s6Ly8vLi92aWV3cy9jb21wb25lbnQtdGFzay1lZGl0LmpzIl0sIm5hbWVzIjpbInNob3dDb25maXJtRGlhbG9nIiwicXVlc3Rpb24iLCJ5ZXMiLCJubyIsIndpbmRvdyIsIlNUVURJUCIsIkRpYWxvZyIsImNvbmZpcm0iLCJzaG93RGlhbG9nIiwiYmFja2JvbmVWaWV3IiwiZGlhbG9nT3B0aW9ucyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaHlnZW5pY0RpYWxvZ0NsYXNzIiwiXyIsInVuaXF1ZUlkIiwiQmFja2JvbmUiLCIkIiwiZG9jdW1lbnQiLCJvbiIsImV2ZW50IiwiZGF0YSIsImRpYWxvZyIsImNsb3Nlc3QiLCJoYXNDbGFzcyIsImFwcGVuZCIsIiRlbCIsInRhcmdldCIsInJlbW92ZSIsIm9mZiIsInNob3ciLCJidXR0b25zIiwiaWQiLCJkaWFsb2dDbGFzcyIsImFjdGlvbk1hcCIsImNyZWF0ZSIsInVwZGF0ZSIsImRlbGV0ZSIsInJlYWQiLCJSZXNwb25zZSIsIk1vZGVsIiwiZXh0ZW5kIiwic3luYyIsIm1ldGhvZCIsIm1vZGVsIiwib3B0aW9ucyIsInVybCIsImFjdGlvbiIsImNsaXFyIiwiY29uZmlnIiwiUExVR0lOX1VSTCIsIlRhc2tFZGl0Q29tcG9uZW50IiwiVmlld21hc3RlciIsInRhZ05hbWUiLCJjbGFzc05hbWUiLCJ0ZW1wbGF0ZSIsInJlcXVpcmUiLCJldmVudHMiLCJpbml0aWFsaXplIiwicHJvdG90eXBlIiwiY2FsbCIsImNvbnNvbGUiLCJsb2ciLCJjb250ZXh0IiwidGFzayIsInRvSlNPTiIsImVkaXRhYmxlIiwiZ2V0Vm90aW5ncyIsImFueSIsInYiLCJnZXQiLCJvbkNsaWNrRWRpdCIsImhpc3RvcnkiLCJuYXZpZ2F0ZSIsInRyaWdnZXIiLCJvbkNsaWNrQ29weUVkaXQiLCJkdXBsaWNhdGUiLCJ0aGVuIiwiY2F0Y2giLCJlcnJvciIsInNob3dFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQkFBZ0I7QUFDbkQsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsY0FBYzs7QUFFbEU7QUFDQTs7Ozs7Ozs7Ozs7O0FDM0VBLGlCQUFpQixtQkFBTyxDQUFDLG9JQUFvRjtBQUM3RyxpRUFBaUU7QUFDakUscUVBQXFFOztBQUVyRTtBQUNBLHNHQUFzRyx3QkFBd0IsY0FBYyxhQUFhO0FBQ3pKO0FBQ0EsdUdBQXVHLHNCQUFzQixhQUFhO0FBQzFJO0FBQ0EsQ0FBQztBQUNELHFFQUFxRTs7QUFFckU7QUFDQSwyR0FBMkcsd0JBQXdCLHNDQUFzQyxhQUFhO0FBQ3RMO0FBQ0EsNEdBQTRHLHFCQUFxQixjQUFjLGFBQWE7QUFDNUo7QUFDQSxDQUFDO0FBQ0Q7O0FBRUEsNkZBQTZGLCtD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QUtwQixLQUFMLENBQVdxQixNQUFYLEVBQWI7QUFDQSxRQUFNQyxRQUFRLEdBQUcsQ0FBQyxLQUFLdEIsS0FBTCxDQUFXdUIsVUFBWCxHQUF3QkMsR0FBeEIsQ0FBNEIsVUFBQUMsQ0FBQztBQUFBLGFBQUlBLENBQUMsQ0FBQ0MsR0FBRixDQUFNLGlCQUFOLENBQUo7QUFBQSxLQUE3QixDQUFsQjtBQUVBLFdBQU87QUFBRU4sVUFBSSxFQUFKQSxJQUFGO0FBQVFFLGNBQVEsRUFBUkE7QUFBUixLQUFQO0FBQ0gsR0F0QnVDO0FBd0J4Q0ssYUF4QndDLHlCQXdCMUI7QUFDVnZELG1EQUFRLENBQUN3RCxPQUFULENBQWlCQyxRQUFqQixxQkFBdUMsS0FBSzdCLEtBQUwsQ0FBV1osRUFBbEQsR0FBd0Q7QUFBRTBDLGFBQU8sRUFBRTtBQUFYLEtBQXhEO0FBQ0gsR0ExQnVDO0FBNEJ4Q0MsaUJBNUJ3Qyw2QkE0QnRCO0FBQUE7O0FBQ2Q1RSxxRUFBaUIsQ0FDYiw0SUFEYSxFQUViLFlBQU07QUFDRixXQUFJLENBQUM2QyxLQUFMLENBQ0tnQyxTQURMLEdBRUtDLElBRkwsQ0FFVSxVQUFBYixJQUFJLEVBQUk7QUFDVmhELHVEQUFRLENBQUN3RCxPQUFULENBQWlCQyxRQUFqQixxQkFBdUNULElBQUksQ0FBQ2hDLEVBQTVDLEdBQWtEO0FBQUUwQyxpQkFBTyxFQUFFO0FBQVgsU0FBbEQ7QUFDQSxlQUFPLElBQVA7QUFDSCxPQUxMLEVBTUtJLEtBTkwsQ0FNVyxVQUFBQyxLQUFLLEVBQUk7QUFDWkMsOERBQVMsQ0FBQywwQkFBRCxFQUE2QkQsS0FBN0IsQ0FBVDtBQUNILE9BUkw7QUFTSCxLQVpZLENBQWpCO0FBY0g7QUEzQ3VDLENBQWxCLENBQTFCO0FBOENlNUIsZ0ZBQWYsRSIsImZpbGUiOiJ0YXNrLXR5cGUubXVsdGlwbGUtY2hvaWNlfnRhc2stdHlwZS5zY2FsZXMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG4iLCJ2YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJy9ob21lL21sdW56ZW5hL1N5bmMvUHJvamVjdHMvZ2l0aHViL0NsaXFyUGx1Z2luL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMnKTtcbm1vZHVsZS5leHBvcnRzID0gKEhhbmRsZWJhcnNbJ2RlZmF1bHQnXSB8fCBIYW5kbGViYXJzKS50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksIGFsaWFzMj1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMz1jb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbjtcblxuICByZXR1cm4gXCIgICAgXCJcbiAgICArIGFsaWFzMygoaGVscGVycy5idXR0b24gfHwgKGRlcHRoMCAmJiBkZXB0aDAuYnV0dG9uKSB8fCBhbGlhczIpLmNhbGwoYWxpYXMxLFwiZWRpdFwiLFwiQmVhcmJlaXRlblwiLHtcIm5hbWVcIjpcImJ1dHRvblwiLFwiaGFzaFwiOntcImljb25cIjpcImVkaXRcIn0sXCJkYXRhXCI6ZGF0YX0pKVxuICAgICsgXCJcXG4gICAgXCJcbiAgICArIGFsaWFzMygoaGVscGVycy5mYWIgfHwgKGRlcHRoMCAmJiBkZXB0aDAuZmFiKSB8fCBhbGlhczIpLmNhbGwoYWxpYXMxLFwiZWRpdFwiLFwiQmVhcmJlaXRlblwiLFwiZWRpdFwiLHtcIm5hbWVcIjpcImZhYlwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSlcbiAgICArIFwiXFxuXCI7XG59LFwiM1wiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGFsaWFzMT1kZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IChjb250YWluZXIubnVsbENvbnRleHQgfHwge30pLCBhbGlhczI9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczM9Y29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgcmV0dXJuIFwiICAgIFwiXG4gICAgKyBhbGlhczMoKGhlbHBlcnMuYnV0dG9uIHx8IChkZXB0aDAgJiYgZGVwdGgwLmJ1dHRvbikgfHwgYWxpYXMyKS5jYWxsKGFsaWFzMSxcImNvcHktZWRpdFwiLFwiQmVhcmJlaXRlblwiLHtcIm5hbWVcIjpcImJ1dHRvblwiLFwiaGFzaFwiOntcImNvbG9yXCI6XCJyZWRcIixcImljb25cIjpcImV4Y2xhaW0tY2lyY2xlXCJ9LFwiZGF0YVwiOmRhdGF9KSlcbiAgICArIFwiXFxuICAgIFwiXG4gICAgKyBhbGlhczMoKGhlbHBlcnMuZmFiIHx8IChkZXB0aDAgJiYgZGVwdGgwLmZhYikgfHwgYWxpYXMyKS5jYWxsKGFsaWFzMSxcImNvcHktZWRpdFwiLFwiQmVhcmJlaXRlblwiLFwiZWRpdFwiLHtcIm5hbWVcIjpcImZhYlwiLFwiaGFzaFwiOntcImNvbG9yXCI6XCJyZWRcIn0sXCJkYXRhXCI6ZGF0YX0pKVxuICAgICsgXCJcXG5cIjtcbn0sXCJjb21waWxlclwiOls3LFwiPj0gNC4wLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxO1xuXG4gIHJldHVybiAoKHN0YWNrMSA9IGhlbHBlcnNbXCJpZlwiXS5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSksKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmVkaXRhYmxlIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIucHJvZ3JhbSgzLCBkYXRhLCAwKSxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pOyIsImltcG9ydCBCYWNrYm9uZSBmcm9tICdiYWNrYm9uZSdcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXG5cbmNvbnN0IHNob3dDb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKHF1ZXN0aW9uLCB5ZXMsIG5vID0gbnVsbCkge1xuICAgIHdpbmRvdy5TVFVESVAuRGlhbG9nLmNvbmZpcm0ocXVlc3Rpb24sIHllcywgbm8pXG59XG5cbmNvbnN0IHNob3dEaWFsb2cgPSBmdW5jdGlvbiAoYmFja2JvbmVWaWV3LCBkaWFsb2dPcHRpb25zKSB7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAgIGNvbnN0IGh5Z2VuaWNEaWFsb2dDbGFzcyA9IF8udW5pcXVlSWQoJ2NsaXFyLS1kaWFsb2ctJylcblxuICAgICAgICBCYWNrYm9uZS4kKGRvY3VtZW50KS5vbihcbiAgICAgICAgICAgIGBkaWFsb2ctdXBkYXRlLiR7aHlnZW5pY0RpYWxvZ0NsYXNzfWAsXG4gICAgICAgICAgICAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5kaWFsb2cuY2xvc2VzdCgnLnVpLWRpYWxvZycpLmhhc0NsYXNzKGh5Z2VuaWNEaWFsb2dDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5kaWFsb2cuYXBwZW5kKGJhY2tib25lVmlldy4kZWwpLmRpYWxvZygnb3BlbicpXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKCkgPT4gZGF0YS5kaWFsb2cuZGlhbG9nKCdjbG9zZScpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgQmFja2JvbmUuJChkb2N1bWVudCkub24oXG4gICAgICAgICAgICBgZGlhbG9nY3JlYXRlLiR7aHlnZW5pY0RpYWxvZ0NsYXNzfWAsXG4gICAgICAgICAgICBgLiR7aHlnZW5pY0RpYWxvZ0NsYXNzfWAsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBCYWNrYm9uZS4kKGV2ZW50LnRhcmdldCkuZGlhbG9nKCdvcHRpb24nLCAnYXV0b09wZW4nLCBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuXG4gICAgICAgIEJhY2tib25lLiQoZG9jdW1lbnQpLm9uKFxuICAgICAgICAgICAgYGRpYWxvZ2Nsb3NlLiR7aHlnZW5pY0RpYWxvZ0NsYXNzfWAsXG4gICAgICAgICAgICBgLiR7aHlnZW5pY0RpYWxvZ0NsYXNzfWAsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoQmFja2JvbmUuJCh0aGlzKS5oYXNDbGFzcyhoeWdlbmljRGlhbG9nQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tib25lVmlldy5yZW1vdmUoKVxuICAgICAgICAgICAgICAgICAgICBCYWNrYm9uZS4kKGRvY3VtZW50KS5vZmYoYC4ke2h5Z2VuaWNEaWFsb2dDbGFzc31gKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuXG4gICAgICAgIHdpbmRvdy5TVFVESVAuRGlhbG9nLnNob3coJycsIHtcbiAgICAgICAgICAgIGJ1dHRvbnM6IG51bGwsXG4gICAgICAgICAgICBpZDogaHlnZW5pY0RpYWxvZ0NsYXNzLFxuICAgICAgICAgICAgLi4uZGlhbG9nT3B0aW9ucyxcbiAgICAgICAgICAgIGRpYWxvZ0NsYXNzOiBgY2xpcXItLWRpYWxvZyAke2h5Z2VuaWNEaWFsb2dDbGFzc31gXG4gICAgICAgIH0pXG4gICAgfSlcblxufVxuXG5leHBvcnQgeyBzaG93Q29uZmlybURpYWxvZywgc2hvd0RpYWxvZyB9XG4iLCJpbXBvcnQgQmFja2JvbmUgZnJvbSAnYmFja2JvbmUnXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJ1xuXG5jb25zdCBhY3Rpb25NYXAgPSB7XG4gICAgY3JlYXRlOiAnY3JlYXRlJyxcbiAgICB1cGRhdGU6ICd1cGRhdGUnLFxuICAgIGRlbGV0ZTogJ2Rlc3Ryb3knLFxuICAgIHJlYWQ6ICdzaG93J1xufVxuXG5jb25zdCBSZXNwb25zZSA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cbiAgICBzeW5jKG1ldGhvZCwgbW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgXy5leHRlbmQob3B0aW9ucywge1xuICAgICAgICAgICAgdXJsOiB0eXBlb2YgbW9kZWwudXJsID09PSAnZnVuY3Rpb24nID8gbW9kZWwudXJsKGFjdGlvbk1hcFttZXRob2RdKSA6IHZvaWQgMFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIEJhY2tib25lLnN5bmMobWV0aG9kLCBtb2RlbCwgb3B0aW9ucylcbiAgICB9LFxuXG4gICAgdXJsKGFjdGlvbikge1xuICAgICAgICBsZXQgaWQgPSB0aGlzLmlkICE9IG51bGwgPyAnLycgKyB0aGlzLmlkIDogJydcbiAgICAgICAgcmV0dXJuIGNsaXFyLmNvbmZpZy5QTFVHSU5fVVJMICsgJ3Jlc3BvbnNlcy8nICsgYWN0aW9uICsgaWQgKyAnP2NhbmNlbF9sb2dpbj0xJ1xuICAgIH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlXG4iLCJpbXBvcnQgQmFja2JvbmUgZnJvbSAnYmFja2JvbmUnXG5pbXBvcnQgVmlld21hc3RlciBmcm9tICcuL3ZpZXdtYXN0ZXInXG5pbXBvcnQgeyBzaG93Q29uZmlybURpYWxvZyB9IGZyb20gJy4uL2RpYWxvZydcbmltcG9ydCBzaG93RXJyb3IgZnJvbSAnLi4vZXJyb3InXG5cbmNvbnN0IFRhc2tFZGl0Q29tcG9uZW50ID0gVmlld21hc3Rlci5leHRlbmQoe1xuICAgIHRhZ05hbWU6ICdzcGFuJyxcbiAgICBjbGFzc05hbWU6ICdjbGlxci0tY29tcG9uZW50LXRhc2stZWRpdCcsXG5cbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vLi4vaGJzL2NvbXBvbmVudC10YXNrLWVkaXQuaGJzJyksXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIC5qcy1lZGl0JzogJ29uQ2xpY2tFZGl0JyxcbiAgICAgICAgJ2NsaWNrIC5qcy1jb3B5LWVkaXQnOiAnb25DbGlja0NvcHlFZGl0J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplKG9wdGlvbnMpIHtcbiAgICAgICAgVmlld21hc3Rlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMpXG5cbiAgICAgICAgY29uc29sZS5sb2coXCJvcHRpb25zOlwiLCBvcHRpb25zKVxuICAgIH0sXG5cbiAgICBjb250ZXh0KCkge1xuICAgICAgICBjb25zdCB0YXNrID0gdGhpcy5tb2RlbC50b0pTT04oKVxuICAgICAgICBjb25zdCBlZGl0YWJsZSA9ICF0aGlzLm1vZGVsLmdldFZvdGluZ3MoKS5hbnkodiA9PiB2LmdldCgncmVzcG9uc2VzX2NvdW50JykpXG5cbiAgICAgICAgcmV0dXJuIHsgdGFzaywgZWRpdGFibGUgfVxuICAgIH0sXG5cbiAgICBvbkNsaWNrRWRpdCgpIHtcbiAgICAgICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZShgdGFzay9lZGl0LyR7dGhpcy5tb2RlbC5pZH1gLCB7IHRyaWdnZXI6IHRydWUgfSlcbiAgICB9LFxuXG4gICAgb25DbGlja0NvcHlFZGl0KCkge1xuICAgICAgICBzaG93Q29uZmlybURpYWxvZyhcbiAgICAgICAgICAgICdEaWVzZSBGcmFnZSBrYW5uIG5pY2h0IG1laHIgZ2XDpG5kZXJ0IHdlcmRlbiwgZGEgc2llIHNjaG9uIGJlYW50d29ydGV0IHd1cmRlLlxcbldvbGxlbiBTaWUgZWluZSBLb3BpZSBkaWVzZXIgRnJhZ2UgZXJzdGVsbGVuIHVuZCBiZWFyYmVpdGVuPycsXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbFxuICAgICAgICAgICAgICAgICAgICAuZHVwbGljYXRlKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odGFzayA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKGB0YXNrL2VkaXQvJHt0YXNrLmlkfWAsIHsgdHJpZ2dlcjogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dFcnJvcignRXJyb3Igd2hpbGUgY29weWluZyB0YXNrJywgZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59KVxuXG5leHBvcnQgZGVmYXVsdCBUYXNrRWRpdENvbXBvbmVudFxuIl0sInNvdXJjZVJvb3QiOiIifQ==