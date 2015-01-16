/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * read only input field but doesn't look like an input field
 * 
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class Display
 */
define(["./Input"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.Display", {
		extend:"Firebrick.ui.fields.Input",
		/**
		 * @property uiName
		 * @type {String}
		 * @default "fb-ui-display"
		 */
		uiName: "fb-ui-display",
		/**
		 * @property readOnly
		 * @type {Boolean}
		 * @default true
		 */
		readOnly: true,
		/**
		 * overwrite input formControlClass
		 * @property formControlClass
		 * @type {String}
		 * @default "formControlClass fb-ui-field-display"
		 */
		formControlClass: "form-control-static fb-ui-field-display",
		
	});
});