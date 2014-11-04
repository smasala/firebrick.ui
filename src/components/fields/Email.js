/**
 * Extends: {{#crossLink "Firebrick.ui.components.fields.Input"}}{{/crossLink}}
 * @module Firebrick.ui.components
 * @extends Firebrick.ui.components.fields.Input
 * @namespace Firebrick.ui.components.fields
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