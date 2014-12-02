/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.button.Button
 * @namespace components.button
 * @class Icon
 */
define(["./Button"], function(){
	return Firebrick.define("Firebrick.ui.button.Icon", {
		extend: "Firebrick.ui.button.Button",
		uiName:"fb-ui-icon",
		/**
		 * @property buttonSize
		 * @type {Boolean|String} boolean = false
		 * @default "xs"
		 */
		btnSize: "xs",
		/**
		 * @property text
		 * @type {String}
		 * @default false
		 */
		text: false,
		/**
		 * @property glyIcon
		 * @type {String}
		 * @default "remove"
		 */
		glyIcon: "remove",
		/**
		 * @property btnStyle
		 * @type {String}
		 * @default "danger"
		 */
		btnStyle: "danger",
		/**
		 * @property afterText
		 * @private
		 * @type {Function}
		 */
		afterText: function(){
			var me = this;
			return me.text ? me.text : "";
		},
		/**
		 * @property buttonTextBindings
		 * @return {Object}
		 */
		buttonTextBindings: function(){
			var me = this,
				obj = me.callParent();
			
			return obj;
		},
		/**
		 * @method buttonTextBindings
		 * @return {Object}
		 */
		buttonTextBindings: function(){
			var me = this,
				obj = me.callParent();
			
			if(obj.hasOwnProperty("text")){
				delete obj["text"];
			}
			
			if(!obj.css){
				obj.css = {};
			}
			obj.css[me.glyphiconClass] = true;
			obj.css[me.parseBind("glyphicon-" + me.glyIcon)] = true;
			
			return obj;
		}
		
	});
});