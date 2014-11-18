/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class Input
 */
define(["text!./Input.html", "./Base"], function(subTpl){
	return Firebrick.define("Firebrick.ui.fields.Input", {
		extend:"Firebrick.ui.fields.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-input",
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl:subTpl,
		/**
		 * @property type
		 * @type {String}
		 * @default "'text'"
		 */
		type:"'text'"
	})
});