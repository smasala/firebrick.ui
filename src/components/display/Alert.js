/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @uses components.common.mixins.Items
 * @class Alert
 */
define(["text!./Alert.html", "../common/Base"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.display.Alert", {
		extend: "Firebrick.ui.common.Base",
		mixins:"Firebrick.ui.common.mixins.Items",
		tpl: tpl,
		uiName:"fb-ui-alert",
		/**
		 * whether the alert is dismissible - also controls whether the X button is shown or not
		 * @property dismissible
		 * @type {Boolean}
		 * @default true
		 */
		dismissible: true,
		/**
		 * @property animationClasses
		 * @type {String|false}
		 * @default "fade in"
		 */
		animationClasses:"fade in",
		/**
		 * alert type, "danger", "info", "warn" etc
		 * @property type
		 * @type {String}
		 * @default "danger" 
		 */
		type: "danger",
		/**
		 * if set, .items will be ignored
		 * @property title
		 * @type {String}
		 * @default ""
		 */
		title:"",
		/**
		 * if set, .items will be ignored
		 * @property content
		 * @type {String}
		 * @default ""
		 */
		content:"",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.attr.role = "'alert'";
			obj.css.alert = true;
			obj.css["'alert-dismissible'"] = me.dismissible;
			if(me.animationClasses){
				obj.css[me.parseBind(me.animationClasses)] = true;
			}
			obj.css[me.parseBind("alert-" + me.type)] = true;
			
			return obj;
		},
		/**
		 * screen reader text
		 * @property srCloseText
		 * @type {String}
		 * @default "Close"
		 */
		srCloseText: "Close",
		/**
		 * @method srCloseIconBindings
		 * @return {Object}
		 */
		srCloseIconBindings: function(){
			var me = this;
			return {
				css:{
					"'sr-only'": true
				},
				text: me.parseBind(me.srCloseText)
			};
		},
		/**
		 * @method closeButtonBindings
		 * @return {Object}
		 */
		closeButtonBindings: function(){
			return {
				attr:{
					type: "'button'",
					"'data-dismiss'": "'alert'"
				},
				css:{
					close: true
				}
			};
		},
	});
});