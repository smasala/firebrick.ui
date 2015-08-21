/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class GridColumn
 */
define( [ "text!./GridColumn.html", "./Base", "../common/mixins/Column" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.GridColumn", {
		extend: "Firebrick.ui.containers.Base",
		mixins: "Firebrick.ui.common.mixins.Column",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.gridcolumn",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this;
			return me.calColumn( me.callParent( arguments ) );
		}
	});
});
