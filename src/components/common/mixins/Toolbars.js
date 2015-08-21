/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Toolbars
 * @static
 */
define( [ "jquery", "./Items", "Firebrick.ui/nav/Toolbar" ], function( $ ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.common.mixins.Toolbars", {
		/**
		 * passed on to the toolbar items (direct children only)
		 * @property _toolbarDefaults
		 * @private
		 * @type {Object}
		 * @default {Object} {
		 * 		navbarItem: true
		 * }
		 */
		_toolbarDefaults: {
			navbarItem: true
		},
		/**
		 * use this to provide the given panel with toolbars
		 * @example
		 * 	toolbar:[{
		 * 		position: "top",
		 * 		items: [{...}]
		 * 	}]
		 * @example
		 * 	toolbar:[{
		 * 		position: "top",
		 * 		items: [{...}]
		 * 	},{
		 * 		position: "bottom",
		 * 		items: [{...}]
		 * 	}]
		 * @property toolbars
		 * @type {Array of Objects}
		 * @default null
		 */
		toolbars: null,
		/**
		 * add css classes and other configuration to the container
		 * @method toolbarContainer
		 * @param obj {Object} obj that is later pass to the binder
		 * @return {Object}
		 */
		toolbarContainer: function( obj ) {
			var me = this,
				toolbarPosition;
			
			if ( me.toolbars && $.isArray( me.toolbars ) ) {
				
				obj.css[ "'fb-ui-toolbar-container'" ] = true;
				
				for ( var i = 0, l = me.toolbars.length; i < l; i++ ) {
					toolbarPosition = me.toolbars[ i ].position;
					if ( toolbarPosition ) {
						obj.css[ me.parseBind( "fb-ui-toolbar-" + toolbarPosition ) ] = true;
					}
				}
			}
			return obj;
		},
		
		/**
		 * @method getToolbars
		 * @return {html}
		 */
		getToolbars: function() {
			var me = this,
				toolbars = me.toolbars,
				tbItem,
				html = "",
				items;
			
			if ( toolbars ) {
				if ( $.isArray( toolbars ) ) {
					for ( var i = 0, l = toolbars.length; i < l; i++ ) {
						tbItem = toolbars[ i ];
						if ( tbItem.items ) {
							//wrap the items inside a toolbar component
							tbItem.sName = "nav.toolbar";
							tbItem.defaults = Firebrick.utils.overwrite( me._toolbarDefaults, ( tbItem.defaults || {}) );
							items = me._getItems( tbItem );
							//load the html for the template compiler
							html += items.html;
							me.toolbars[ i ] = items.items[ 0 ];
						} else {
							console.warn( "a toolbar was found without the items property and didn't render" );
						}
					}
				} else {
					console.warn( "unable to load toolbars for this panel", me, "toolbars property must be an array of objects" );
				}
			}
			
			return html;
		}
	});
});
