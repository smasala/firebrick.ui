/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module ui.components
 * @extends ui.components.fields.Input
 * @namespace ui.components.fields
 * @class Email
 */
define(["./Input"], function(){
	return Firebrick.define("Firebrick.ui.fields.Email", {
		extend:"Firebrick.ui.fields.Input",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-email",
		/**
		 * @property type
		 * @type {String}
		 * @default "'email'"
		 */
		type:"'email'",
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'text'"
		 */
		dataType:"'text'"
	})
});