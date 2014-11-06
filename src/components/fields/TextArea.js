/**
 * Extends: {{#crossLink "Firebrick.ui.components.fields.Input"}}{{/crossLink}}
 * @module ui.components
 * @extends ui.components.fields.Input
 * @namespace ui.components.fields
 * @class TextArea
 */
define(["text!./TextArea.html", "./Input"], function(subTpl){
	return Firebrick.define("Firebrick.ui.fields.TextArea", {
		extend:"Firebrick.ui.fields.Input",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-textarea",
		/**
		 * number of rows high
		 * @property rows
		 * @type {Int}
		 * @default 5
		 */
		rows:5,
		/**
		 * @property subTpl
		 * @type {String}
		 */
		subTpl:subTpl,
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'textarea'"
		 */
		dataType:"'textarea'"
	})
});