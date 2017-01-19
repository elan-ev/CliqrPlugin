webpackJsonp([1],{100:function(e,i,n){"use strict";var t=n(95),c=t.a.extend({className:"cliqr--multiple-choice-create-view",onSubmitForm:function(e){e.preventDefault(),this.model.isValid()&&this.taskGroup.trigger("newTask",this.model)}});i.a=c},101:function(e,i,n){"use strict";var t=n(95),c=t.a.extend({className:"cliqr--multiple-choice-edit-view",onSubmitForm:function(e){e.preventDefault(),this.model.isValid()&&this.type.trigger("editTask",this.model)},onClickCancel:function(e){e.preventDefault(),Backbone.history.navigate("/task/show/"+this.model.id,{trigger:!0})}});i.a=c},102:function(e,i,n){"use strict";var t=n(0),c=n.n(t),l=n(1),a=n.n(l),r=n(10),o=function(e,i){var n=i.getTask();return{response:e.toJSON(),voting:a.a.omit(i.toJSON(),"task"),task:n.toJSON(),answers:n.get("task").answers,isSingleSelect:"single"===n.get("task").type}},s=r.a.extend({className:"cliqr--multiple-choice-poll-view",events:{"submit form":"onSubmitForm"},initialize:function(e){r.a.prototype.initialize.call(this),this.voting=e.voting},template:n(121),context:function(){return o(this.model,this.voting)},postRender:function(){var e=window.MathJax.Hub;this.$(".description, .text").each(function(i,n){return e.Queue(["Typeset",e,n])})},onSubmitForm:function(e){e.preventDefault();var i=c.a.$(e.target).closest("form").serializeArray();this.model.set("response",{answer:a.a.map(i,function(e){return parseInt(e.value,10)})}),this.voting.trigger("newResponse",this.model,this.voting)}});i.a=s},103:function(e,i,n){"use strict";var t=n(93),c=t.a.extend({defaults:{}});i.a=c},104:function(e,i,n){"use strict";var t=n(0),c=n.n(t),l=n(1),a=n.n(l),r=Object.assign||function(e){for(var i=1;i<arguments.length;i++){var n=arguments[i];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},o=function(e){var i=e.get("id");return r({},e.toJSON(),{answers:a.a.map(e.get("task").answers,function(e,n){return r({},e,{id:i+"-"+n,isCorrect:!!e.score})}),isSingleSelect:"single"===e.get("task").type})},s=c.a.View.extend({tagName:"section",className:"cliqr--multiple-choice-show-view",render:function(){var e=n(122);return this.$el.html(e(o(this.model))),this},postRender:function(){var e=window.MathJax.Hub;this.$(".cliqr--mc-description, td.text").each(function(i,n){return e.Queue(["Typeset",e,n])})}});i.a=s},105:function(e,i,n){"use strict";function t(e){if(Array.isArray(e)){for(var i=0,n=Array(e.length);i<e.length;i++)n[i]=e[i];return n}return Array.from(e)}var c=n(1),l=n.n(c),a=n(12),r=Object.assign||function(e){for(var i=1;i<arguments.length;i++){var n=arguments[i];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},o=a.a.extend({defaults:{type:"multiple-choice",task:{type:"single",answers:[]}},validate:function(e,i){var n=e.description,t=e.task;if(!n||l.a.isEmpty(n))return"Der Fragetext darf nicht leer sein.";if(window.STUDIP.wysiwyg&&n.trim()===window.STUDIP.wysiwyg.htmlMarker)return"Der Fragetext darf nicht leer sein.";if(!t)return"Task fehlt.";var c=t.answers,a=void 0!==c&&c;return!a||l.a.isEmpty(a)?"Es wird mindestens eine Antwort benötigt.":null},addAnswer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=this.get("task"),c=[].concat(t(n.answers),[r({text:"",score:0,feedback:""},e)]);this.set("task",r({},n,{answers:c}),i)},removeAnswer:function(e){var i=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},this.get("task")),n=[].concat(t(i.answers.slice(0,e)),t(i.answers.slice(e+1)));this.set("task",r({},i,{answers:n}))},updateAnswer:function(e,i){var n=(arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},this.get("task")),c=n.answers[e],l=[].concat(t(n.answers.slice(0,e)),[r({},c,i)],t(n.answers.slice(e+1)));this.set("task",r({},n,{answers:l}),{silent:!0})}});i.a=o},116:function(e,i,n){i=e.exports=n(49)(),i.push([e.i,"#cliqr-container .cliqr--multiple-choice-assignment-view .cliqr--mc-description,#cliqr-poll-container .cliqr--multiple-choice-assignment-view .cliqr--mc-description{font-weight:400;font-size:2.75em}#cliqr-container .cliqr--multiple-choice-assignment-view table,#cliqr-poll-container .cliqr--multiple-choice-assignment-view table{font-size:2em;line-height:1.5;overflow:hidden;border-collapse:collapse}#cliqr-container .cliqr--multiple-choice-assignment-view table .nominal,#cliqr-poll-container .cliqr--multiple-choice-assignment-view table .nominal{color:#999;font-size:.7em;width:1em}#cliqr-container .cliqr--multiple-choice-assignment-view table .text,#cliqr-poll-container .cliqr--multiple-choice-assignment-view table .text{padding-left:.25em}#cliqr-container .cliqr--multiple-choice-assignment-view table .count,#cliqr-container .cliqr--multiple-choice-assignment-view table .graph,#cliqr-container .cliqr--multiple-choice-assignment-view table .percent,#cliqr-poll-container .cliqr--multiple-choice-assignment-view table .count,#cliqr-poll-container .cliqr--multiple-choice-assignment-view table .graph,#cliqr-poll-container .cliqr--multiple-choice-assignment-view table .percent{padding-left:.5em}#cliqr-container .cliqr--multiple-choice-assignment-view .chart,#cliqr-poll-container .cliqr--multiple-choice-assignment-view .chart{display:inline-block;background-color:#28497c;background-image:-webkit-linear-gradient(left,#a9b6cb,#28497c);background-image:linear-gradient(90deg,#a9b6cb,#28497c);background-repeat:repeat-x;height:1em;margin-left:.5em;vertical-align:text-top;border:1px solid #232323}#cliqr-container .cliqr--multiple-choice-assignment-view .count,#cliqr-poll-container .cliqr--multiple-choice-assignment-view .count{color:#a9b6cb}#cliqr-container .cliqr--multiple-choice-assignment-view .percent,#cliqr-poll-container .cliqr--multiple-choice-assignment-view .percent{font-size:.66em;color:#000}#cliqr-container .cliqr--multiple-choice-show-view .cliqr--mc-description,#cliqr-poll-container .cliqr--multiple-choice-show-view .cliqr--mc-description{font-weight:400;font-size:2.75em}#cliqr-container .cliqr--multiple-choice-show-view table,#cliqr-poll-container .cliqr--multiple-choice-show-view table{font-size:2em;line-height:1.5;overflow:hidden;border-collapse:collapse}#cliqr-container .cliqr--multiple-choice-show-view table .nominal,#cliqr-poll-container .cliqr--multiple-choice-show-view table .nominal{color:#999;font-size:.7em;width:1em}#cliqr-container .cliqr--multiple-choice-show-view table .text,#cliqr-poll-container .cliqr--multiple-choice-show-view table .text{padding-left:.25em}#cliqr-container .cliqr--multiple-choice-create-view .cliqr--mc-description .cke_contents,#cliqr-container .cliqr--multiple-choice-edit-view .cliqr--mc-description .cke_contents,#cliqr-poll-container .cliqr--multiple-choice-create-view .cliqr--mc-description .cke_contents,#cliqr-poll-container .cliqr--multiple-choice-edit-view .cliqr--mc-description .cke_contents{font-size:2.75em}#cliqr-container .cliqr--multiple-choice-create-view .choices .choice-input,#cliqr-container .cliqr--multiple-choice-edit-view .choices .choice-input,#cliqr-poll-container .cliqr--multiple-choice-create-view .choices .choice-input,#cliqr-poll-container .cliqr--multiple-choice-edit-view .choices .choice-input{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row;-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline}#cliqr-container .cliqr--multiple-choice-create-view .choices input,#cliqr-container .cliqr--multiple-choice-edit-view .choices input,#cliqr-poll-container .cliqr--multiple-choice-create-view .choices input,#cliqr-poll-container .cliqr--multiple-choice-edit-view .choices input{-webkit-box-flex:1;-ms-flex:1;flex:1;margin-bottom:5px;padding:4px 6px;border:1px solid #ccc;box-shadow:inset 0 1px 2px rgba(0,0,0,.024)}#cliqr-container .cliqr--multiple-choice-create-view .choices span.nominal,#cliqr-container .cliqr--multiple-choice-edit-view .choices span.nominal,#cliqr-poll-container .cliqr--multiple-choice-create-view .choices span.nominal,#cliqr-poll-container .cliqr--multiple-choice-edit-view .choices span.nominal{line-height:30px;display:inline-block;background-color:#e7ebf1;vertical-align:middle;padding:0 .5em}#cliqr-container .cliqr--multiple-choice-create-view .choices .choice-input+.choice-input,#cliqr-container .cliqr--multiple-choice-edit-view .choices .choice-input+.choice-input,#cliqr-poll-container .cliqr--multiple-choice-create-view .choices .choice-input+.choice-input,#cliqr-poll-container .cliqr--multiple-choice-edit-view .choices .choice-input+.choice-input{margin-top:.5em}#cliqr-container .cliqr--multiple-choice-create-view .choices .choice-input input,#cliqr-container .cliqr--multiple-choice-edit-view .choices .choice-input input,#cliqr-poll-container .cliqr--multiple-choice-create-view .choices .choice-input input,#cliqr-poll-container .cliqr--multiple-choice-edit-view .choices .choice-input input{display:inline-block}#cliqr-container .cliqr--multiple-choice-create-view .choices .cliqr--mc-choice-actions,#cliqr-container .cliqr--multiple-choice-edit-view .choices .cliqr--mc-choice-actions,#cliqr-poll-container .cliqr--multiple-choice-create-view .choices .cliqr--mc-choice-actions,#cliqr-poll-container .cliqr--multiple-choice-edit-view .choices .cliqr--mc-choice-actions{margin-left:8px}#cliqr-container .cliqr--multiple-choice-create-view .choices .choices-required,#cliqr-container .cliqr--multiple-choice-edit-view .choices .choices-required,#cliqr-poll-container .cliqr--multiple-choice-create-view .choices .choices-required,#cliqr-poll-container .cliqr--multiple-choice-edit-view .choices .choices-required{position:relative}#cliqr-container .cliqr--multiple-choice-create-view .choices .choices-required select,#cliqr-container .cliqr--multiple-choice-edit-view .choices .choices-required select,#cliqr-poll-container .cliqr--multiple-choice-create-view .choices .choices-required select,#cliqr-poll-container .cliqr--multiple-choice-edit-view .choices .choices-required select{position:absolute;left:0;top:-25px;z-index:-1;border:none}#cliqr-container .cliqr--multiple-choice-poll-view .description,#cliqr-poll-container .cliqr--multiple-choice-poll-view .description{font-size:2em}#cliqr-container .cliqr--multiple-choice-poll-view li,#cliqr-poll-container .cliqr--multiple-choice-poll-view li{padding:0}#cliqr-container .cliqr--multiple-choice-poll-view label,#cliqr-poll-container .cliqr--multiple-choice-poll-view label{display:block;padding:.75rem 1.25rem;margin:0}",""])},118:function(e,i,n){var t=n(2);e.exports=(t.default||t).template({compiler:[7,">= 4.0.0"],main:function(e,i,n,t,c){var l,a=null!=i?i:{},r=n.helperMissing,o="function",s=e.escapeExpression;return'<textarea name="'+s((l=null!=(l=n.key||(null!=i?i.key:i))?l:r,typeof l===o?l.call(a,{name:"key",hash:{},data:c}):l))+'" class="x-wysiwyg" required="required">'+s((l=null!=(l=n.value||(null!=i?i.value:i))?l:r,typeof l===o?l.call(a,{name:"value",hash:{},data:c}):l))+"</textarea>\n"},useData:!0})},119:function(e,i,n){function t(e){return e&&(e.__esModule?e.default:e)}var c=n(2);e.exports=(c.default||c).template({1:function(e,i,n,t,c){return""},3:function(e,i,c,l,a,r,o){var s,u=null!=i?i:{},p=e.escapeExpression;return'                <tr>\n                    <td class="nominal"> '+p(t(n(91)).call(u,a&&a.index,{name:"nominal",hash:{},data:a}))+' </td>\n                    <td class="text"> '+p(e.lambda(null!=i?i.text:i,i))+" </td>\n\n"+(null!=(s=c.unless.call(u,null!=o[1]?o[1].isRunning:o[1],{name:"unless",hash:{},fn:e.program(4,a,0,r,o),inverse:e.noop,data:a}))?s:"")+"                </tr>\n"},4:function(e,i,n,t,c){var l;return'                        <td class="graph"></td>\n                        <td class="count">'+e.escapeExpression(e.lambda(null!=i?i.votes_count:i,i))+'</td>\n                        <td class="percent">\n                            '+(null!=(l=n.if.call(null!=i?i:{},null!=i?i.votes_count:i,{name:"if",hash:{},fn:e.program(5,c,0),inverse:e.noop,data:c}))?l:"")+"\n                        </td>\n"},5:function(e,i,n,t,c){return e.escapeExpression(e.lambda(null!=i?i.percent:i,i))+"%"},compiler:[7,">= 4.0.0"],main:function(e,i,n,t,c,l,a){var r,o=null!=i?i:{};return'<header>\n    <div class="cliqr--mc-description">'+(null!=(r=e.lambda(null!=(r=null!=i?i.task:i)?r.description_html:r,i))?r:"")+"</div>\n"+(null!=(r=n.if.call(o,null!=i?i.isSingleSelect:i,{name:"if",hash:{},fn:e.program(1,c,0,l,a),inverse:e.program(1,c,0,l,a),data:c}))?r:"")+"</header>\n\n<main>\n    <table>\n        <tbody>\n"+(null!=(r=n.each.call(o,null!=i?i.answers:i,{name:"each",hash:{},fn:e.program(3,c,0,l,a),inverse:e.noop,data:c}))?r:"")+"        </tbody>\n    </table>\n</main>\n"},useData:!0,useDepths:!0})},120:function(e,i,n){function t(e){return e&&(e.__esModule?e.default:e)}var c=n(2);e.exports=(c.default||c).template({1:function(e,i,n,t,c){return'        <div class="messagebox messagebox_error">\n            Fehler: '+e.escapeExpression(e.lambda(null!=i?i.error:i,i))+"\n        </div>\n"},3:function(e,i,c,l,a){var r=null!=i?i:{},o=e.escapeExpression,s=e.lambda;return'                    <div class="choice-input">\n                        <span class="nominal">'+o(t(n(91)).call(r,a&&a.index,{name:"nominal",hash:{},data:a}))+'</span>\n\n                        <input\n                            class="choice" maxlength="100" type="text"\n                            name="answers['+o(s(a&&a.index,i))+']"\n                            value="'+o(s(null!=i?i.text:i,i))+'" required>\n\n                        <span class="cliqr--mc-choice-actions">\n                            '+o(t(n(5)).call(r,"remove","Entfernen","trash",{name:"fab",hash:{},data:a}))+"\n                            "+o(t(n(5)).call(r,"upload","Bild hochladen","upload",{name:"fab",hash:{},data:a}))+"\n                            <!--"+o(t(n(5)).call(r,"options","Optionen","tools",{name:"fab",hash:{},data:a}))+"-->\n                        </span>\n                    </div>\n"},5:function(e,i,c,l,a){return'                    <div class="choices-required">\n                        <select required oninvalid="setCustomValidity(\''+e.escapeExpression(t(n(92)).call(null!=i?i:{},"Mindestens eine Antwort wird benötigt.",{name:"i18n",hash:{},data:a}))+"')\"></select>\n                    </div>\n"},7:function(e,i,c,l,a){return"            "+e.escapeExpression(t(n(3)).call(null!=i?i:{},"cancel","Abbrechen",{name:"button",hash:{icon:"decline"},data:a}))+"\n"},compiler:[7,">= 4.0.0"],main:function(e,i,c,l,a){var r,o=null!=i?i:{},s=e.escapeExpression;return'<form class="default" method="post" accept-char="UTF-8">\n\n'+(null!=(r=c.if.call(o,null!=i?i.error:i,{name:"if",hash:{},fn:e.program(1,a,0),inverse:e.noop,data:a}))?r:"")+'\n    <fieldset>\n        <legend>Multiple-Choice-Frage</legend>\n        <label>\n            Was möchten Sie fragen?\n            <div class="cliqr--mc-description"></div>\n        </label>\n    </fieldset>\n\n    <fieldset>\n        <legend>Antwortmöglichkeiten</legend>\n        <label>\n            Tragen Sie die Antworten ein\n\n            <div class="choices">\n'+(null!=(r=c.each.call(o,null!=(r=null!=(r=null!=i?i.task:i)?r.task:r)?r.answers:r,{name:"each",hash:{},fn:e.program(3,a,0),inverse:e.noop,data:a}))?r:"")+"\n                "+s(t(n(3)).call(o,"add","Antwort hinzufügen",{name:"button",hash:{class:"choice-add",icon:"add"},data:a}))+"\n\n"+(null!=(r=c.unless.call(o,null!=(r=null!=(r=null!=i?i.task:i)?r.task:r)?r.answers:r,{name:"unless",hash:{},fn:e.program(5,a,0),inverse:e.noop,data:a}))?r:"")+"            </div>\n\n        </label>\n    </fieldset>\n\n    <fieldset>\n        "+s(t(n(3)).call(o,"save","Speichern",{name:"button",hash:{icon:"accept"},data:a}))+"\n"+(null!=(r=c.if.call(o,null!=(r=null!=i?i.task:i)?r.id:r,{name:"if",hash:{},fn:e.program(7,a,0),inverse:e.noop,data:a}))?r:"")+"    </fieldset>\n</form>\n"},useData:!0})},121:function(e,i,n){function t(e){return e&&(e.__esModule?e.default:e)}var c=n(2);e.exports=(c.default||c).template({1:function(e,i,n,t,c){var l;return'                <p class="lead"> '+e.escapeExpression(e.lambda(null!=(l=null!=i?i.task:i)?l.title:l,i))+" </p>\n"},3:function(e,i,c,l,a,r,o){var s,u=null!=i?i:{},p=e.escapeExpression;return'                        <li class="list-group-item">\n                            <label>\n'+(null!=(s=c.if.call(u,null!=o[1]?o[1].isSingleSelect:o[1],{name:"if",hash:{},fn:e.program(4,a,0,r,o),inverse:e.program(6,a,0,r,o),data:a}))?s:"")+'                                <span class="nominal">'+p(t(n(91)).call(u,a&&a.index,{name:"nominal",hash:{},data:a}))+':</span>\n                                <span class="text">'+p(e.lambda(null!=i?i.text:i,i))+"</span>\n                            </label>\n                        </li>\n"},4:function(e,i,n,t,c){return'                                    <input type="radio" name="choice" value="'+e.escapeExpression(e.lambda(c&&c.index,i))+'" required>\n'},6:function(e,i,n,t,c){var l=e.lambda,a=e.escapeExpression;return'                                    <input type="checkbox" name="choice['+a(l(c&&c.index,i))+']" value="'+a(l(c&&c.index,i))+'">\n'},compiler:[7,">= 4.0.0"],main:function(e,i,n,t,c,l,a){var r,o=null!=i?i:{};return'<section class="cliqr--multiple-choice-poll">\n    <div class="jumbotron">\n        <div class="container">\n'+(null!=(r=n.if.call(o,null!=(r=null!=i?i.task:i)?r.title:r,{name:"if",hash:{},fn:e.program(1,c,0,l,a),inverse:e.noop,data:c}))?r:"")+'\n            <div class="description">'+(null!=(r=e.lambda(null!=(r=null!=i?i.task:i)?r.description_html:r,i))?r:"")+'</div>\n        </div>\n    </div>\n\n    <div class="container">\n        <form action="" method="post">\n\n            <div class="form-group">\n                <ul class="list-group">\n'+(null!=(r=n.each.call(o,null!=i?i.answers:i,{name:"each",hash:{},fn:e.program(3,c,0,l,a),inverse:e.noop,data:c}))?r:"")+'                </ul>\n            </div>\n\n\n            <div class="form-group">\n                <button class="btn btn-primary btn-block" type="submit">Antwort abschicken</button>\n            </div>\n        </form>\n\n    </div>\n</section>\n'},useData:!0,useDepths:!0})},122:function(e,i,n){function t(e){return e&&(e.__esModule?e.default:e)}var c=n(2);e.exports=(c.default||c).template({1:function(e,i,c,l,a){var r=e.escapeExpression;return'                <tr>\n                    <td class="nominal"> '+r(t(n(91)).call(null!=i?i:{},a&&a.index,{name:"nominal",hash:{},data:a}))+' </td>\n                    <td class="text"> '+r(e.lambda(null!=i?i.text:i,i))+" </td>\n                </tr>\n"},compiler:[7,">= 4.0.0"],main:function(e,i,n,t,c){var l;return'<header>\n    <div class="cliqr--mc-description">'+(null!=(l=e.lambda(null!=i?i.description_html:i,i))?l:"")+"</div>\n</header>\n\n<main>\n    <table>\n        <tbody>\n"+(null!=(l=n.each.call(null!=i?i:{},null!=i?i.answers:i,{name:"each",hash:{},fn:e.program(1,c,0),inverse:e.noop,data:c}))?l:"")+"        </tbody>\n    </table>\n</main>\n"},useData:!0})},129:function(e,i,n){var t=n(116);"string"==typeof t&&(t=[[e.i,t,""]]);n(50)(t,{});t.locals&&(e.exports=t.locals)},51:function(e,i,n){"use strict";function t(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}var c=n(0),l=n.n(c),a=n(1),r=n.n(a),o=n(98),s=n(100),u=n(101),p=n(102),h=n(104),d=n(105),m=n(103),v=n(129),f=(n.n(v),function(){function e(e,i){for(var n=0;n<i.length;n++){var t=i[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(i,n,t){return n&&e(i.prototype,n),t&&e(i,t),i}}()),g=function(){function e(i){t(this,e),this.task=i}return f(e,[{key:"getAssignmentView",value:function(e){return new o.a({model:this.task,voting:e,type:this})}},{key:"getShowView",value:function(){return new h.a({model:this.task,type:this})}},{key:"getEditView",value:function(){return new u.a({model:this.wrapTask(this.task),type:this})}},{key:"getCreateView",value:function(e){return new s.a({model:this.createTask(),taskGroup:e,type:this})}},{key:"getPollView",value:function(e){return new p.a({model:this.createResponse(e),voting:e,type:this})}},{key:"createTask",value:function(e){var i=new d.a;return r.a.times(2,function(){return i.addAnswer()}),i}},{key:"wrapTask",value:function(e){return new d.a(e.attributes)}},{key:"createResponse",value:function(e){var i=new m.a({voting_id:e.id,task_id:e.getTask().id});return i}}]),e}();r.a.extend(g.prototype,l.a.Events),i.default=g},91:function(e,i,n){"use strict";var t=n(2),c=(n.n(t),"A".charCodeAt(0)),l=function(e){return String.fromCharCode(c+parseInt(e,10)%26)};e.exports=l},92:function(e,i,n){"use strict";var t=n(2),c=(n.n(t),function(e,i){i.hash;return e=n.i(t.escapeExpression)(e),new t.SafeString(e)});e.exports=c},93:function(e,i,n){"use strict";var t=n(0),c=n.n(t),l=n(1),a=n.n(l),r={create:"create",update:"update",delete:"destroy",read:"show"},o=c.a.Model.extend({sync:function(e,i,n){return a.a.extend(n,{url:"function"==typeof i.url?i.url(r[e]):void 0}),c.a.sync(e,i,n)},url:function(e){var i=null!=this.id?"/"+this.id:"";return cliqr.config.PLUGIN_URL+"responses/"+e+i}});i.a=o},95:function(e,i,n){"use strict";var t=n(0),c=n.n(t),l=n(1),a=(n.n(l),n(10)),r=n(99),o=a.a.extend({tagName:"section",events:{"click .js-add":"onClickAdd","click .js-remove":"onClickRemove","submit form":"onSubmitForm","click .js-cancel":"onClickCancel","keypress input.choice":"onChoiceUpdate","change input.choice":"onChoiceUpdate","input input.choice":"onChoiceUpdate"},initialize:function(e){var i=this;a.a.prototype.initialize.call(this),this.type=e.type,this.taskGroup=e.taskGroup;var n=new r.a({model:this.model,key:"description"});this.setView(".cliqr--mc-description",n),this.listenTo(this.model,"change",this.render),this.listenTo(this.model,"invalid",function(){return i.render({force:!0})})},template:n(120),context:function(){return{taskGroup:this.taskGroup&&this.taskGroup.toJSON(),task:this.model.toJSON(),error:this.model.validationError||null}},afterTemplate:function(){console.log("rendered")},onClickAdd:function(e){e.preventDefault(),this.model.addAnswer()},onClickRemove:function(e){e.preventDefault();var i=parseInt(c.a.$(e.target).closest(".choice-input").find("input[name]").attr("name").match(/\d+/)[0],10);this.model.removeAnswer(i)},onChoiceUpdate:function(e){var i=c.a.$(e.target),n=parseInt(i.attr("name").match(/\d+/)[0],10),t=i.val();this.model.updateAnswer(n,{text:t})}});i.a=o},98:function(e,i,n){"use strict";var t=n(0),c=n.n(t),l=n(1),a=n.n(l),r=n(10),o=Object.assign||function(e){for(var i=1;i<arguments.length;i++){var n=arguments[i];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},s=function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=e.get("id"),t=u(e,i),c=i.toJSON(),l=a.a.reduce(t,function(e,i){return e+i},0);return o({},c,{task:a.a.first(c.test.tasks),isRunning:i.isRunning(),answers:a.a.map(e.get("task").answers,function(e,i){return o({},e,{id:n+"-"+i,isCorrect:!!e.score,votes_count:t[i],percent:l?Math.floor(t[i]/l*100):0})}),isSingleSelect:"single"===e.get("task").type,votes_count:l})},u=function(e,i){for(var n=[],t=0,c=e.get("task").answers.length;t<c;++t)n[t]=0;return a.a.reduce(i&&i.get("responses"),function(e,i){return a.a.each(i.answer,function(i){return e[i]++}),e},n)},p=r.a.extend({tagName:"section",className:"cliqr--multiple-choice-assignment-view",initialize:function(e){var i=e.voting;r.a.prototype.initialize.call(this),this.voting=i,this.listenTo(this.voting,"change",this.render)},template:n(119),context:function(){return s(this.model,this.voting)},afterTemplate:function(){this.voting.isRunning()||this.postRender()},postRender:function(){this.voting.isRunning()||this.enhanceChart(this.context());var e=window.MathJax.Hub;this.$(".cliqr--mc-description, td.text").each(function(i,n){return e.Queue(["Typeset",e,n])})},enhanceChart:function(e){this.$(".chart").remove();var i=150,n=e.answers,t=a.a.max(a.a.pluck(n,"votes_count")),l=a.a.map(n,function(e){return t>0?e.votes_count/t*i:0});this.$(".graph").append(function(e){return n[e].votes_count?c.a.$('<span class="chart"></span>').css({width:l[e],marginLeft:t?i-l[e]:0}):null})}});i.a=p},99:function(e,i,n){"use strict";var t=n(0),c=n.n(t),l=n(10),a=l.a.extend({tagName:"div",className:"cliqr--component-wysiwyg",events:{"keypress textarea":"onTextUpdate","change textarea":"onTextUpdate","input textarea":"onTextUpdate"},initialize:function(e){l.a.prototype.initialize.call(this),this.key=e.key,this.listenTo(this.model,"change:"+this.key,this.onModelChange)},remove:function(){this.removeWysiwyg(),l.a.prototype.remove.call(this)},editor:null,removeWysiwyg:function(){this.editor&&(this.editor.removeAllListeners(),this.editor=null)},template:n(118),context:function(){return{key:this.key,value:this.model.get(this.key)}},afterTemplate:function(){var e=this.$("textarea").get(0);if(e&&window.STUDIP.wysiwyg){window.STUDIP.wysiwyg.replace(e);var i=window.CKEDITOR.dom.element.get(e);i&&(this.editor=i.getEditor(),this.editor.on("change",this.onEditorChange,this))}},onEditorChange:function(e){var i=e.editor;this.model.set(this.key,i.getData(),{silent:!0})},onTextUpdate:function(e){var i=c.a.$(e.target).val();this.model.set(this.key,i,{silent:!0})},onModelChange:function(){this.render()}});i.a=a}});
//# sourceMappingURL=task-type.multiple-choice.chunk.js.map