/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class GridRow
 */
define( [ "text!./GridRow.html", "./Base", "./GridColumn" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.GridRow", {
		extend: "Firebrick.ui.containers.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.gridrow",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @property rowClass
		 * @type {Boolean|String}
		 * @default true
		 */
		rowClass: true,
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {sName: "containers.gridcolum"}
		 */
		defaults: {
			sName: "containers.gridcolumn"
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css.row = me.rowClass;
			
			return obj;
		},
		/**
		 * @method getBasicBindings
		 * @return {Object}
		 */
		getBasicBindings: function() {
			var me = this,
				obj = {
						css: {}
				};
			obj.css[ me.parseBind( "col-md-" + ( Math.floor( 12 / me.items.length ) ) ) ] = true;
			return obj;
		},
		/**
		 * used when calling {{{getGridItem}}} in template
		 * @method getGridItem
		 * @param {Int} iteration index
		 * @param {Object} iteration object
		 * @param {Context} iteration context
		 * @return {String}
		 */
		getGridItem: function( index, item ) {
			var me = this,
				newItem = me._getItems( item );
			
			if ( newItem ) {
				//replace items with the new object - _getItems returns an object {html:"", items:[]}
				me.items[ index ] = newItem.items[ 0 ];
				
				return newItem.html;
			}
			return "";
		}
	});
});
