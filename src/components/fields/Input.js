/**
 * Extends: {{#crossLink "Firebrick.ui.components.fields.Base"}}{{/crossLink}}
 * @module Firebrick.ui.components
 * @extends Firebrick.ui.components.fields.Base
 * @namespace Firebrick.ui.components.fields
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