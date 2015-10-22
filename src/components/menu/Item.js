/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @private
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.menu
 * @class Item
 */
define( [ "text!./Item.html", "../common/Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.menu.Item", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Items",
		sName: "menu.item",
		text: null,
		value: null,
		href: null,
		divider: false,
		tpl: tpl,
		/**
		 * @property defaults
		 * @type {object}
		 * @default {
		 * 		sName: "menu.item"
		 * }
		 */
		defaults: {
			sName: "menu.item"
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( me.divider ) {
				obj.css.divider = true;
			}
			
			obj.attr.role = "'presentation'";
			
			return obj;
		},
		/**
		 * @method linkBindings
		 * @return {Object}
		 */
		linkBindings: function() {
			var me = this,
				obj = {
					attr: {}
				};
			
			if ( me.href ) {
				obj.href = me.href;
			}
			if ( me.text ) {
				obj.text = me.textBind( "text" );
			}
			
			obj.attr.role = "'menuitem'";
			obj.attr.tabindex = "-1";
			
			return obj;
		}
	});
});
