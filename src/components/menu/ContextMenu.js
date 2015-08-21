/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @private
 * @module Firebrick.ui.components
 * @extends components.menu.Menu
 * @namespace components.menu
 * @class ContextMenu
 */
define( [ "jquery", "./Menu", "../common/mixins/Items" ], function( $ ) {
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.menu.ContextMenu", {
		extend: "Firebrick.ui.menu.Menu",
		mixins: "Firebrick.ui.common.mixins.Items",
		sName: "menu.contextmenu",
		target: "body",
		enclosedBind: true,
		appendTarget: true,
		contextMenuEvent: null,
		
		init: function() {
			var me = this;
			
			me.on( "rendered", function() {
				me._initContext();
				me.position();
			});
			
			return me.callParent( arguments );
		},
		
		position: function() {
			var me = this,
				el = $( "> ul", me.getElement() ),
				event = me.contextMenuEvent;
	
			el.css({
				position: "absolute",
				"z-index": "10000",
				top: event.clientY,
				left: event.clientX,
				display: "block"
			});
		},
		
		_initContext: function() {
			var me = this,
				globalClick = function( e ) {
					var $e = $( e.target ),
						$el = me.getElement();
					
					if ( !$el.is( $e ) || $el.has( $e ).length ) {
						me.destroy();
						$( document ).off( "click", globalClick );
					}
					
				};
				
			$( document ).on( "click", globalClick );
		},
		
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'fb-ui-contextmenu'" ] = true;
			
			return obj;
		}
	});
	
});
