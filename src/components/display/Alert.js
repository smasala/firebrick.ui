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
define(["text!./Alert.html", "../common/Base", "../common/mixins/Items"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.display.Alert", {
		extend: "Firebrick.ui.common.Base",
		mixins:"Firebrick.ui.common.mixins.Items",
		tpl: tpl,
		sName:"display.alert",
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
		 * store property key
		 * @property storeProp
		 * @type {String}
		 * @default ""
		 */
		storeProp: "",
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String}
		 * @default ""
		 */
		html: "",
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
		 * @method paragraphBindings
		 * @return {Object}
		 */
		paragraphBindings: function(){
			var me = this,
				obj = {};
			
			if(me.storeProp){
				obj.html = me.storeProp;
			}else{
				obj.html = "Firebrick.getById('"+me.getId()+"').html";
			}
			
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