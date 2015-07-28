/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class Hidden
 */
define(["./Input"], function(){
	"use strict";
	
	return Firebrick.define("Firebrick.ui.fields.Hidden", {
		extend: "fields.input",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fields.hidden"
		 */
		sName: "fields.hidden",
		/**
		 * @method containerBindings
		 * @return {Object}
		 */
		containerBindings: function(){
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css["'fb-ui-hidden-field'"] = true;
			
			return obj;
		}
	});
	
});