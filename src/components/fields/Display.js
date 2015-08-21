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
define( [ "text!./Display.html", "./Input" ], function( subTpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Display", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-display"
		 */
		sName: "fields.display",
		/**
		 * overwrite input formControlClass
		 * @property formControlClass
		 * @type {String}
		 * @default "formControlClass fb-ui-field-display"
		 */
		formControlClass: "form-control-static",
		/**
		 * @property subTpl
		 * @type {html}
		 * @default Display.html
		 */
		subTpl: subTpl,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent(),
				text = obj.value;
			
			delete obj.attr.readonly;
			delete obj.attr.disabled;
			delete obj.attr.type;
			delete obj.attr.placeholder;
			//delete obj.value;
			
			obj.text = text;
			
			return obj;
		}
	});
});
