/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Accordion
 */
define( [ "text!./Accordion.html", "./Base", "./Panel", "bootstrap.plugins/collapse" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Accordion", {
		extend: "Firebrick.ui.containers.Base",
		/**
		 * @property tpl
		 * @type {String} html
		 * @default Accordion.html
		 */
		tpl: tpl,
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.accordion",
		
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {
		 * 		sName: "containers.panel"
		 * }
		 */
		defaults: {
			sName: "containers.panel",
			collapsible: true,
			role: "tab",
			collapseRole: "tabpanel"
		},
		/**
		 * @property role
		 * @type {String}
		 * @default "tablist"
		 */
		role: "tablist",
		/**
		 * @property ariaMultiselectable
		 * @type {Boolean}
		 * @default true
		 */
		ariaMultiselectable: true,
		/**
		 * @property panelGroupClass
		 * @type {String|false}
		 * @default "panel-group"
		 */
		panelGroupClass: "panel-group",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			//<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
			
			obj.attr.role = me.parseBind( me.role );
			obj.attr[ "'aria-multiselectable'" ] = me.ariaMultiselectable;
			if ( me.panelGroupClass ) {
				obj.css[ me.parseBind( me.panelGroupClass ) ] = true;
			}
			
			return obj;
		},
		
		getItems: function() {
			var me = this,
				item;
			
			for ( var i = 0, l = me.items.length; i < l; i++ ) {
				item = me.items[ i ];
				item.dataParentId = me.parseBind( "#" + me.getId() );
				item.collapsed = item.active ? false : true;
			}
			
			return me.callParent( arguments );
		}
	});
});
