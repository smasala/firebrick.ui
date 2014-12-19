/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.button
 * @class Button
 */
define(["text!./Button.html", "../common/Base", "../common/mixins/Items", "./dropdown/List"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.button.Button", {
		extend:"Firebrick.ui.common.Base",
		mixins:"Firebrick.ui.common.mixins.Items",
		uiName: "fb-ui-button",
		tpl:tpl,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text:"",
		/**
		 * type: button, submit
		 * @property type
		 * @type {String}
		 * @default "button"
		 */
		type: "button",
		/**
		 * if true - att "navbar-btn" class to the button
		 * @property navbarItem
		 * @type {Boolean}
		 * @default false
		 */
		navbarItem: false,
		/**
		 * @property btnSize
		 * @type {Boolean|String} false |  ("sm", "lg", "xs")
		 * @default false
		 */
		btnSize:false,
		/**
		 * @property btnStyle
		 * @type {Boolean|String} false | (default, primary, success, info, warning, danger, link)
		 * @default "default"
		 */
		btnStyle:"default",
		/**
		 * used to inject something before the text <span>
		 * @property beforeText
		 * @type {Any}
		 * @default ""
		 */
		beforeText: "",
		/**
		 * used to inject something after the text <span>
		 * @property afterText
		 * @type {Any}
		 * @default ""
		 */
		afterText: "",
		/**
		 * passed to list data property
		 * @property items
		 * @type {String}
		 * @default null
		 */
		items:null,
		/**
		 * default bindings called by data-bind={{data-bind}}
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.attr.type = me.parseBind(me.type);
			obj.css.btn = true;
			
			if(me.btnStyle){
				obj.css[ me.parseBind("btn-"+me.btnStyle)] = true;
			}
			if(me.btnSize){
				obj.css[ me.parseBind("btn-" + me.btnSize)] = true;
			}
			
			if(me.items){
				obj.css["'dropdown-toggle'"] = true;
				obj.attr["'data-toggle'"] = "'dropdown'";
			}
			
			if(me.navbarItem){
				obj.css["'navbar-btn'"] = true;
			}
			
			return obj;
		},
		/**
		 * @property buttonTextBindings
		 * @return {Object}
		 */
		buttonTextBindings: function(){
			var me = this;
			return {
				text: me.textBind(me.text)
			};
		},
		/**
		 * @method caretBindings
		 * @return {Object}
		 */
		caretBindings: function(){
			return {
				css: {
					caret: true
				}
			};
		},
		/**
		 * @method dropdownContainerBindings
		 * @return {Object}
		 */
		dropdownContainerBindings: function(){
			return {
				css: {
					dropdown: true
				}
			};
		}
	});
});