/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Progress
 */
define(["text!./Progress.html", "../common/Base"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.display.Progress", {
		extend: "Firebrick.ui.common.Base",
		uiName:"fb-ui-progress",
		tpl: tpl,
		/**
		 * progress html5 element max attribute
		 * @property max
		 * @type {Integer|String|Function}
		 * @default 100
		 */
		max:100,
		/**
		 * progress html5 element value attribute
		 * @property value
		 * @type {Integer|String|Function} use a string or function for data binding 
		 * @default 0
		 */
		value:0,
		/**
		 * whether or not to show a label with the progress bar
		 * @property showLabel
		 * @type {Boolean}
		 * @default true
		 */
		showLabel: true,
		/**
		 * used to append to the data-value attribute value
		 * @property dataSymbol
		 * @type {String}
		 * @default "%"
		 */
		dataSymbol: "%",
		/**
		 * @property label
		 * @type {String}
		 * @default ""
		 */
		label: "",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this;
			return {
				attr:{
					max: me.max,
					value: me.value
				},
				text: me.parseBind(me.value+"%")
			};
		},
		/**
		 * @method progressLabelBindings
		 */
		progressLabelBindings: function(){
			var me = this;
			return {
				css: {
					"'progress-label'": true
				},
				attr: {
					"'data-symbol'": me.parseBind(me.dataSymbol),
					"'data-value'": me.value
				},
				text: "fb.text('" + me.label + "')",
				style: {
					width: me.parseBind(me.value+"%")
				}
			};
		},
		/**
		 * @method progressContainerBindings
		 */
		progressContainerBindings: function(){
			return {
				css:{
					"'progress-container'": true
				}
			};
		}
	});
});