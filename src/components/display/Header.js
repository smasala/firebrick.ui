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
		 * @property headerSize
		 * @type {Int}
		 * @default 1
		 */
		headerSize:1,
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
		 * @property labelStyle
		 * @type {Boolean|String}
		 * @default "default"
		 */
		labelStyle: "default",
		/**
		 * change to a url if you wish to convert the header into a link
		 * @property href
		 * @type {String}
		 * @default null
		 */
		href: null,
		/**
		 * @method textBindings
		 * @return Object
		 */
		textBindings: function(){
			var me = this,
				obj = {};
			
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
					text: me.textBind(me.secondaryText)
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
						text: me.textBind(me.labelText),
						css:{
							label: true
						}
					};
				if(me.labelStyle){
					obj.css[ me.parseBind( "label-"+me.labelStyle ) ] = true;
				}
				return obj;
			}else{
				return {
					visible:false
				};
			}
		},
		
		/**
		 * @method hrefBindings
		 * @return {Object}
		 */
		hrefBindings: function(){
			return {};
		}
		
	});
});