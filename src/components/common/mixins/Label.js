/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Label
 * @static
 */
define( [ "text!./tpl/Label.html" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.common.mixins.Label", {
		/**
		 * @property labelTpl
		 * @type {String} html
		 * @default Label.html
		 */
		labelTpl: tpl,
		/**
		 * add Label css classes
		 * @property labelCSS
		 * @type {String}
		 * @default ""
		 */
		labelCSS: "",
		/**
		 * @property labelText
		 * @type {String}
		 * @default ""
		 */
		labelText: "",
		/**
		 * @method getLabelTpl
		 */
		getLabelTpl: function() {
			var me = this;
			me.template( "labelTpl" );
			return me.build( "labelTpl" );
		},
		/**
		 * string = "default", "primary", "success" "info", "warning", "danger"
		 * @property labelStyle
		 * @type {Boolean|String}
		 * @default "default"
		 */
		labelStyle: "default",
		/**
		 * @method labelBindings
		 * @return Object
		 */
		labelBindings: function() {
			var me = this,
				obj = {
						text: me.textBind( me.labelText ),
						css: {
							label: true
						}
					};
			
				if ( me.labelStyle ) {
					obj.css[ me.parseBind( "label-" + me.labelStyle ) ] = true;
				}
				
			if ( me.labelCSS ) {
				obj.css[ me.parseBind( me.labelCSS ) ] = true;
			}
				
			return obj;
		}
	});
});
