/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.button.Base
 * @namespace components.button
 * @class Button
 */
define(["text!./Button.html", "./Base", "../common/mixins/Badges", "./dropdown/List"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.button.Button", {
		extend:"Firebrick.ui.button.Base",
		mixins:["Firebrick.ui.common.mixins.Badges"],
		sName: "button.button",
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
		 * @property dropdownContainerClass
		 * @type {String|false}
		 * @default "dropdown"
		 */
		dropdownContainerClass: "dropdown",
		/**
		 * if true - att "navbar-btn" class to the button
		 * @property navbarItem
		 * @type {Boolean}
		 * @default false
		 */
		navbarItem: false,
		/**
		 * @property splitButton
		 * @type {Boolean}
		 * @default false
		 */
		splitButton: false,
		/**
		 * @property btnSize
		 * @type {Boolean|String} false |  ("sm", "lg", "xs")
		 * @default false
		 */
		btnSize:false,
		/**
		 * @property disabled
		 * @type {Boolean}
		 * @default false
		 */
		disabled: false,
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
		 * bootstrap glyphicon class
		 * @property glyIcon
		 * @type {String}
		 * @default null
		 */
		glyIcon: null,
		/**
		 * used to inject something after the text <span>
		 * @property afterText
		 * @type {Any}
		 * @default ""
		 */
		afterText: "",
		/**
		 * set as string to give the button stateful capabilities.
		 * @property loadingText
		 * @type {Boolean|String} when set as string, the value is assigned to the button "button-loading-text" attribute
		 * @default false
		 */
		loadingText: false,
		/**
		 * @property dropdownConfig
		 * @type {Object}
		 * @default null
		 */
		dropdownConfig: null,
		/**
		 * @property srOnlyText
		 * @type {String}
		 * @default "Toggle Dropdown"
		 */
		srOnlyText: "Toggle Dropdown",
		/**
		 * only works if this button is used in a modal
		 * @property closeModal
		 * @type {Boolean}
		 * @default false
		 */
		closeModal: false,
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
			
			//firefox bug fix
			obj.attr.autocomplete = "'off'";
			//--//
						
			if(me.btnStyle){
				obj.css[ me.parseBind("btn-"+me.btnStyle)] = true;
			}
			if(me.btnSize){
				obj.css[ me.parseBind("btn-" + me.btnSize)] = true;
			}
			
			if(me.items && !me.splitButton){
				obj.css["'dropdown-toggle'"] = true;
				obj.attr["'data-toggle'"] = "'dropdown'";
			}
			
			if(me.navbarItem){
				obj.css["'navbar-btn'"] = true;
			}
			
			if(me.loadingText){
				obj.attr["'data-loading-text'"] = me.textBind( me.loadingText );
			}
			
			if(me.closeModal){
				obj.attr["'data-dismiss'"] = "'modal'";
			}
			
			if(me.disabled){
				obj.attr.disabled = "'disabled'";
			}
			
			return obj;
		},
		/**
		 * @property buttonTextBindings
		 * @return {Object}
		 */
		buttonTextBindings: function(){
			var me = this,
				obj = {
						css: {},
						text: me.textBind(me.text),
				};
			
			if(me.glyIcon){
				obj.css.glyphicon = true;
				obj.css[me.parseBind("glyphicon-" + me.glyIcon)] = true;
			}
			
			return obj;
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
			var me = this,
				obj = {
					css:{}
				};
			
			if(me.splitButton){
				obj.css["'btn-group'"] = true;
			}else{
				//standard dropdown
				if(me.dropdownContainerClass && !me.splitButton){
					obj.css[me.parseBind( me.dropdownContainerClass )] = true;	
				}
			}
			
			
			return obj;
		},
		/**
		 * @method getDropdown
		 * @return {Object}
		 */
		getDropdown: function(){
			var me = this,
				obj = {
					sName: "button.dropdown.list",
					items: $.isArray(me.items) ? "Firebrick.ui.getCmp('" + me.getId() + "').items" : me.items
				};
			
			obj = Firebrick.utils.copyover(obj, me.dropdownConfig);

			return me._getItems(obj).html;
		},
		
		/**
		 * @method splitButtonBindings
		 * @return {Object}
		 */
		splitButtonBindings: function(){
			var me = this,
				obj = {css:{}, attr:{}};
			
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
			obj.attr["'aria-expanded'"] = false;
			
			return obj;
		},
		
		/**
		 * @method splitButtonSrOnlyBinding
		 * @return {Object}
		 */
		splitButtonSrOnlyBinding: function(){
			var me = this,
				obj = {css:{}};
			
			obj.css["'sr-only'"] = true;
			obj.text = me.textBind(me.srOnlyText);
			
			return obj;
		},
		/**
		 * @method setEnabled
		 * @event enabled
		 * @event disabled
		 * @param enable {Boolean}
		 */
		setEnabled: function( enable ){
			var me = this,
				$el = me.getElement();
			if(enable){
				$el.removeAttr("disabled");
				me.fireEvent("enabled");
			}else{
				$el.attr("disabled", "disabled");
				me.fireEvent("disabled");
			}
		}
	});
});