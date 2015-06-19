/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./ComboBox.html","jquery","text!./combo/Item.html","text!./combo/Value.html","doT","knockout","./Input","Firebrick.ui.engines/Suggest","../display/Loader"],function(e,t,n,r,i,s){return Firebrick.define("Firebrick.ui.fields.ComboBox",{extend:"Firebrick.ui.fields.Input",sName:"fields.combobox",subTpl:e,multiSelect:!1,maxItems:!1,forceSelect:!1,typeahead:1,showOnFocus:!1,store:null,itemTpl:n,valueTpl:r,_itemTemplate:null,_resultsVisible:!1,labelKey:"text",valueKey:"value",_valueEl:null,suggest:null,_engine:null,_timestamp:null,getValueEl:function(){var e=this;return e._valueEl||(e._valueEl=t("> .fb-ui-combo-values",e.getElement())),e._valueEl},_inputEl:null,getInputEl:function(){var e=this;return e._inputEl||(e._inputEl=t("> input.fb-ui-combo-input",e.getElement())),e._inputEl},showCaret:!0,_caretEl:null,getCaretEl:function(){var e=this;return e._caretEl||(e._caretEl=t("> .fb-ui-combo-select",e.getElement())),e._caretEl},_resultEl:null,getResultEl:function(){var e=this;return e._resultEl||(e._resultEl=e.getElement().next(".fb-ui-combo-result[data-for='"+e.getId()+"']")),e._resultEl},_clearIconEl:null,getClearIconEl:function(){var e=this;return e._clearIconEl||(e._cleanIconEl=t(".fb-ui-combo-clear-icon",e.getElement())),e._cleanIconEl},init:function(){var e=this;return e._itemTemplate={},e.on("rendered",function(){e._initSuggestionEngine(),e._initRendered()}),e.on("removeAll",function(){e.getClearIconEl().hide()}),e.callParent(arguments)},_initSuggestionEngine:function(){var e=this,t={store:e.store,filter:function(e){return!e._exclude}};t=Firebrick.utils.overwrite(t,e.suggest||{}),e._engine=Firebrick.create("Firebrick.ui.engines.Suggest",t)},_initRendered:function(){var e=this,n=e.getElement(),r=e.getInputEl(),i=e.getResultEl(),s=e.getClearIconEl();n.on({click:function(){return e._onClick.apply(e,arguments)}}),s.on({click:function(){return e._onClearIconClick.apply(e,arguments)}}),r.on("keydown keyup fb.update blur",function(){return e.resizeInput.apply(e,arguments)}),r.on({focus:function(){return e._onFocus.apply(e,arguments)},keydown:function(){return e._onKeyDown.apply(e,arguments)},keyup:function(){return e._onKeyUp.apply(e,arguments)},blur:function(){return e._onBlur.apply(e,arguments)}}),i.on("mousedown",".fb-ui-combo-item",function(){return e._onItemClick.apply(e,arguments)}),i.on("mouseover",".fb-ui-combo-item",function(){return e._onMouseOver.apply(e,arguments)}),e.multiSelect&&n.on("click",".fb-ui-combo-value-item",function(){return e.removeItem(t(this))}),e.on({expand:function(){var e=this,n=e.getElement(),r=e.getResultEl(),i=e.getActiveItem(),s;n.addClass("open"),e.forceSelect&&!i.length&&(s=t(".fb-ui-combo-item:first-child",r),s.length&&e.markActive(s))},collapse:function(){e.resultDefaults()}})},resultDefaults:function(){var e=this,t=e.getElement();t.removeClass("open")},_onFocus:function(){var e=this;e.showOnFocus&&e._engine.mode==="local"&&e.showResults(),e.getValue().length&&e.getClearIconEl().show()},_onClick:function(){var e=this,t=e.getElement(),n=e.getInputEl();n.focus()},_onClearIconClick:function(){this.removeAll()},_onItemClick:function(){var e=this;e.selectActive()},_onMouseOver:function(e){var n=this,r="fb-ui-combo-item",i="."+r,s=t(e.target);s.hasClass(r)||(s=s.parent(i)),n.markActive(s)},_onKeyDown:function(e){var t=this,n=e.which,r=t.getInputEl();n===KeyboardEvent.DOM_VK_RETURN?e.preventDefault():n===KeyEvent.DOM_VK_BACK_SPACE&&(r.val()||t.removeLastItem()),t._arrowKey(n),t._timestamp=(new Date).getTime()},_onKeyUp:function(e){var t=this,n=e.which,r=t.getElement(),i=t.getInputEl();t.actionKey(n)?n===KeyboardEvent.DOM_VK_RETURN?(e.preventDefault(),t.selectActive()):n===KeyboardEvent.DOM_VK_DOWN&&(i.val()||t._resultsVisible||t.showResults()):i.val().trim()?Firebrick.delay(function(){var e=(new Date).getTime();e-t._timestamp>=300&&(t._timestamp=e,t.showResults())},301):t.hideResults()},_onBlur:function(){var e=this;e.forceSelect&&(e.getValue().length||e.selectActive()),Firebrick.delay(function(){e.getClearIconEl().hide()},200),e.reset()},reset:function(){var e=this;e.hideResults(),e.clearInput()},resizeInput:function(){var e=this,t=e.getInputEl(),n=t.width(),r=e._measureWidth(t)+8;r!==n&&t.width(r)},_measureWidth:function(e){var n=t("<tmp>").css({position:"absolute",top:-99999,left:-99999,width:"auto",padding:0,whiteSpace:"pre"}).text(e.val()).appendTo("body"),r=["letterSpacing","fontSize","fontFamily","fontWeight","textTransform"],i,s={},o;for(var u=0,a=r.length;u<a;u++)i=r[u],s[i]=e.css(i);return n.css(s),o=n.width(),n.remove(),o},actionKey:function(e){return e===KeyboardEvent.DOM_VK_DOWN||e===KeyboardEvent.DOM_VK_UP||e===KeyboardEvent.DOM_VK_RETURN?!0:!1},getActiveItem:function(){var e=this,n=t(".fb-ui-combo-item.active",e.getResultEl());return n},markActive:function(e){var t=this,n=t.getActiveItem();e.length&&(n.removeClass("active"),e.addClass("active"),e.focus())},selectActive:function(e){var t=this,n=e||t.getActiveItem(),r=t.options,i={},s,o=[];n.length&&(i=n.prop("data-value"),i._exclude=!0,o.push(i),t.setValue(o),o.length&&t.getClearIconEl().show())},removeAll:function(){var e=this,n=e.getValue(),r=t(".fb-ui-combo-value-item",e.getValueEl());for(var i=0,s=r.length;i<s;i++)t(r[0]).prop("data-value")._exclude=!1;r.remove(),e._checkChange(e.getValue(),n),e.fireEvent("removeAll")},removeItem:function(e){var t=this,n=t.getValue(),r=e.prop("data-value");r._exclude=!1,e.remove(),t._checkChange(t.getValue(),n),t.on("removeItem")},removeLastItem:function(){var e=this,n=t(".fb-ui-combo-value-item",e.getValueEl()),r=n.last();if(n.length===1&&e.forceSelect)return;r.length&&e.removeItem(r)},clearInput:function(){var e=this,t=e.getInputEl();t.val("")},_arrowKey:function(e){var n=this,r=window.KeyboardEvent,i=".fb-ui-combo-item",s=n.getResultEl(),o=t(i+".active",s),u;if(n._resultsVisible)if(e===r.DOM_VK_DOWN||e===r.DOM_VK_UP)return o.length?(e===r.DOM_VK_DOWN?u=o.next(i):u=o.prev(i),n.markActive(u),n._scrollOnKey(e,u,s)):n.markActive(t("> .fb-ui-combo-item:first-child",s)),!0;return!1},getSelection:function(){var e=this,n=e.getResultEl();if(e._resultsVisible)return t(".fb-ui-combo-item.active",n)},_scrollOnKey:function(e,t,n){var r,i,s=n.offset().top,o=n.height(),u=s+o,a=null;t.length&&(e===window.KeyboardEvent.DOM_VK_DOWN?(i=t.offset().top+t.outerHeight(),i>u&&(a=n.scrollTop()+i-s-o)):(r=t.offset().top,r<s&&(a=r-s+n.scrollTop())),a!==null&&n.scrollTop(a))},search:function(e,t){var n=this;return e&&e.length>=n.typeahead&&n._engine.query(e,t),n},showResults:function(){var e=this,t=e.getElement(),n=e.getInputEl(),r=e.getResultEl(),i,s;r.empty(),r.css({top:t.offset().top+t.outerHeight(),width:t.outerWidth()}),r.show(),e._resultsVisible=!0,e._engine.mode!=="local"&&(i=Firebrick.create("Firebrick.ui.display.Loader",{target:r})),Firebrick.delay(function(){e.search(n.val().trim(),function(t){var n=[];i&&i.destroy();if(t){for(var o=0,u=t.length;o<u;o++)s=t[o],s.index=o,n.push(e.renderItem(s));r.empty(),r.append(n),r.scrollTop(0),e.fireEvent("expand")}})},10)},hideResults:function(){var e=this,t=e.getElement(),n=e.getInputEl(),r=e.getResultEl();e._resultsVisible&&(e._resultsVisible=!1,r.hide(),e.fireEvent("collapse"))},renderItem:function(e,t){return this._renderItem("itemTpl",e,t)},renderValueItem:function(e,t){return this._renderItem("valueTpl",e,t)},_renderItem:function(e,n,r){var s=this,o=t.isFunction(s[e])?s[e]():s[e];return n._scope=n._scope||r||s,s._itemTemplate[e]||(s._itemTemplate[e]=i.template(o)),t(s._itemTemplate[e](n)).prop("data-value",n)},bindings:function(){var e=this,t=e.callParent(arguments);return t.css["'fb-ui-combobox'"]=!0,e.multiSelect?t.css.multiple=!0:t.css.single=!0,t},valueBindings:function(){var e=this,t={css:{"'fb-ui-combo-values'":!0}};return t},inputBindings:function(){var e=this,t={css:{},attr:{autocomplete:!0,tabindex:!0}};return t.css["'fb-ui-combo-input'"]=!0,t},clearIconBindings:function(){var e=this,t={css:{glyphicon:!0,"'glyphicon-remove-circle'":!0,"'fb-ui-combo-clear-icon'":!0}};return t},singleSelectBindings:function(){var e=this,t={css:{"'fb-ui-combo-select'":!0,caret:e.showCaret}};return t},resultBindings:function(){var e=this,t={css:{"'fb-ui-combo-result'":!0}};return t},_hasChange:function(e,t){return!Firebrick.utils.compareArrays(e,t)},getValue:function(){var e=this,n=t("> .fb-ui-combo-value-item",e.getValueEl()),r=[],i=e.valueKey,s;for(var o=0,u=n.length;o<u;o++)s=t(n[o]).prop("data-value"),s=i?s[i]:s,r.push(s);return r},setValue:function(){var e=this,n=e.getValueEl();if(e.maxItems!==!1&&t(".fb-ui-combo-value-item",n).length===e.maxItems)return;return e.callParent(arguments)},_setValue:function(e){var t=this,n=t.getValueEl(),r=[];if(e.length){for(var i=0,s=e.length;i<s;i++)r.push(t.renderValueItem(e[i]));t.multiSelect?n.append(r):n.html(r),t.reset()}return t}})});