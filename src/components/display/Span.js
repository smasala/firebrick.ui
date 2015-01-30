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
		uiName:"fb-ui-span",
		tpl: tpl,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text:"",
		
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.text = "Firebrick.getById('"+me.getId()+"').text";
			
			return obj;
		}
	});
});