/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Header
 */
define(["text!./Header.html", "../common/Base"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.display.Header", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-header",
		/**
		 * @property tpl
		 * @type {String}
		 */
		tpl:tpl,
		/**
		 * use to determine whether h1, h2, h3 etc - default = 1
		 * @property headerType
		 * @type {Int}
		 * @default 1
		 */
		headerType:1,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text:"",
		/**
		 * @property secondaryText
		 * @type {String}
		 * @default ""
		 */
		secondaryText:"",
		/**
		 * @property labelText
		 * @type {String}
		 * @default ""
		 */
		labelText:"",
		/**
		 * string = "default", "primary", "success" "info", "warning", "danger"  
		 * @property labelCSS
		 * @type {Boolean|String}
		 * @default "default"
		 */
		labelCSS: "default",
		/**
		 * @method bindings
		 * @return Object
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.text = me.textBind(me.text);
			
			return obj;
		},
		/**
		 * @method secondaryTextBindings
		 * @return Object
		 */
		secondaryTextBindings: function(){
			var me = this;
			if(me.secondaryText){
				return {
					text: me.secondaryText
				};
			}else{
				return {
					visible:false
				};
			}
		},
		/**
		 * @method labelBindings
		 * @return Object
		 */
		labelBindings: function(){
			var me = this, 
				obj;
			if(me.labelText){
				obj = {
						text: me.labelText,
						css:{
							label: true
						}
					};
				if(me.labelCSS){
					obj.css[ me.parseBind( "label-"+me.labelCSS ) ] = true;
				}
				return obj;
			}else{
				return {
					visible:false
				};
			}
		}
		
	});
});