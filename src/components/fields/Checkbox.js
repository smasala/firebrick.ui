/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Radio
 * @namespace components.fields
 * @class Checkbox
 */
define( [ "./Radio" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Checkbox", {
		extend: "Firebrick.ui.fields.Radio",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.checkbox",
		/**
		 * @property type
		 * @type {String}
		 * @default "'checkbox'"
		 */
		type: "checkbox",
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'checklist'"
		 */
		dataType: "checklist",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );

			if ( me.inplaceEdit ) {
				obj.editable = me.selectedOptions || false;
				obj.editableOptions = {
						optionsValue: me.parseBind( me.optionsPropValue ),
						optionsText: me.parseBind( me.optionsPropText ),
						options: me.options,
						type:  me.parseBind( me.dataType )
				};
			}
			
			return obj;
		}
	});
});
