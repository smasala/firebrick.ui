/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Span
 */
define(["text!./Span.html", "../common/Base"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.display.Span", {
		extend: "Firebrick.ui.common.Base",
		sName:"display.span",
		tpl: tpl,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text:"",
		/**
		 * set as "primary", "default", "warning", "danger", "success", "info" to convert the span to a BS label component
		 * @property labelStyle
		 * @type {String}
		 * @default ""
		 */
		labelStyle: "",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.text = "Firebrick.getById('"+me.getId()+"').text";
			
			if(me.labelStyle){
				me.css.label = true;
				me.css[me.parseBind("label-" + me.labelStyle)] = true;
			}
			
			return obj;
		}
	});
});