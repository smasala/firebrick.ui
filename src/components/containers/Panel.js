/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Panel
 */
define( [ "text!./Panel.html", "text!./panel/Icon.html", "jquery", "doT", "./Base", "../nav/Toolbar", "../common/mixins/Toolbars", "../common/mixins/Label" ], function( tpl, iconTpl, $, doT ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Panel", {
		extend: "Firebrick.ui.containers.Base",
		mixins: [ "Firebrick.ui.common.mixins.Toolbars",
		         "Firebrick.ui.common.mixins.Label" ],
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.panel",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * used to the default header icons
		 * @property iconTpl
		 * @type {String} html
		 */
		iconTpl: iconTpl,
		/**
		 * @property role
		 * @type {String}
		 * @default ""
		 */
		role: "",
		/**
		 * @property collapseRole
		 * @type {String}
		 * @default ""
		 */
		collapseRole: "",
		/**
		 * @property title
		 * @type {String|false} set to false to hide the title
		 * @default ""
		 */
		title: "",
		/**
		 * use to determine whether h1, h2, h3 etc - default = 3
		 * @property headerSize
		 * @type {Int}
		 * @default 3
		 */
		headerSize: 3,
		/**
		 * @property panelClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelClass: true,
		/**
		 * string = (default, primary, success, info, warning, danger)
		 * @property panelTypeClass
		 * @type {Boolean|String}
		 * @default "default"
		 */
		panelTypeClass: "default",
		/**
		 * @property panelHeaderClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelHeaderClass: true,
		/**
		 * @property panelBodyClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelBodyClass: true,
		/**
		 * determines whether "panel-title" class is used
		 * @property
		 * @type {Boolean}
		 * @default true
		 */
		panelTitleClass: true,
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String|Function}
		 * @default ""
		 */
		html: "",
		/**
		 * @property collapsible
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsible: false,
		/**
		 * @property showCollapseIcon
		 * @type {Boolean}
		 * @default true
		 */
		showCollapseIcon: true,
		/**
		 * @property collapsed
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsed: false,
		/**
		 * @private
		 * @property _collapsedState
		 * @type {Boolean}
		 * @default false
		 */
		_collapsedState: false,
		/**
		 * @property headerItems
		 * @type {Boolean|Array of Objects} boolean = false, if object use the same way as the "items" property
		 * @default false
		 */
		headerItems: false,
		/**
		 * @property headerIconsPosition
		 * @type {String|false} css class "pull-right", "pull-left" etc
		 * @default "pull-right"
		 */
		headerItemsPosition: "pull-right",
		/**
		 * @private
		 * @property _collapsedClass
		 * @type {String}
		 * @default "fb-ui-is-collapsed"
		 */
		_collapsedClass: "fb-ui-is-collapsed",
		/**
		 * only needed when panel is inside accordion
		 * @property dataParentId
		 * @type {String}
		 * @default ""
		 */
		dataParentId: "",
		/**
		 * only needed when panel is inside accordion
		 * @property active
		 * @type {Boolean}
		 * @default false
		 */
		active: false,
		/**
		 * @property maximizable
		 * @type {Boolean}
		 * @default false
		 */
		maximizable: false,
		/**
		 * array of icon posibilites after headerItems (custom), like collapse icon, maximize icon etc
		 * @property _defaultPanelIcons
		 * @private
		 * @type {Array of Strings}
		 * @default ["maximizable", "collapsible"]
		 */
		_defaultPanelIcons: [ "collapsible", "maximizable" ],
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function() {
			var me = this;
			
			me._collapsedState = me.collapsed;
			
			me.on( "rendered", function() {
				var panel = me.getElement(),
					eventFunction;

				if ( me.collapsed ) {
					panel.addClass( me._collapsedClass );
				}
				
				eventFunction = function() {
					panel.toggleClass( me._collapsedClass );
					panel.trigger( "fb-ui-panel-state-change" );
					me._collapsedState = !me._collapsedState;	//toggle value
				};
				
				//this is important for the collapse icon
				panel.on( "show.bs.collapse hide.bs.collapse", eventFunction );
				
				me.on( "unbound", function() {
					panel.off( "show.bs.collapse hide.bs.collapse", eventFunction );
				});
				
			});
			
			return me.callParent( arguments );
		},
		
		/**
		 * programmatically make toggleCollapse action - useful if the header isn't available
		 * @method toggleCollapse
		 * @return self
		 */
		toggleCollapse: function() {
			var me = this;
				
			if ( me._collapsedState ) {
				me.expand();
			} else {
				me.collapse();
			}
			
			return me;
		},
		/**
		 * used within the Panel.html template
		 * iterates through the _defaultPanelIcons array and builds for each value a
		 * template from panel/Icon (this.iconTpl) together for each property
		 * @private
		 * @method defaultPanelIcons
		 * @return {String} html
		 */
		getDefaultIcons: function() {
			var me = this,
				it,
				icons = me._defaultPanelIcons,
				html = "",
				conf;
			
			for ( var i = 0, l = icons.length; i < l; i++ ) {
				it = icons[ i ];
				conf = {
					property: icons[ i ],
					showProperty: "show" + Firebrick.utils.firstToUpper( it ),
					bindingMethod: it + "IconBindings",
					scope: me
				};
				html += doT.template( me.iconTpl )( conf );
			}
			
			return html;
		},
		/**
		 * programmatically make a collapse action - useful if the header isn't available
		 * @method collapse
		 * @return self
		 */
		collapse: function() {
			var me = this,
				panel = me.getElement(),
				collapsiblePart = $( "> .panel-collapse", panel );
		
			collapsiblePart.collapse( "hide" );
			
			return me;
		},
		
		/**
		 * programmatically make an expand action - useful if the header isn't available
		 * @method expand
		 * @return self
		 */
		expand: function() {
			var me = this,
				panel = me.getElement(),
				collapsiblePart = $( "> .panel-collapse", panel );
	
			collapsiblePart.collapse( "show" );
			
			return me;
		},
		
		/**
		 * Data bindings
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );

			obj.css.panel = me.panelClass;

			if ( me.panelTypeClass ) {
				obj.css[ me.parseBind( "panel-" + me.panelTypeClass ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method tabBindings
		 * @return {Object}
		 */
		tabBindings: function() {
			var me = this,
				obj = {
					css: {},
					attr: {
						id: me.parseBind( "fb-ui-collapse-" + me.getId() )
					}
			};
			
			if ( me.collapsible ) {
				obj.css[ "'panel-collapse'" ] = me.collapsible;
				obj.css.collapse = me.collapsible;
				if ( !me.collapsed ) {
					obj.css[ "in" ] = true;
				}
			} else if ( me.collapsed ) {
				//just collapsed
				obj.css[ "'panel-collapse'" ] = true;
				obj.css.collapse = true;
			}
			
			if ( me.collapseRole ) {
				obj.attr.role = me.parseBind( me.collapseRole );
			}
			
			obj.css[ "'fb-ui-panel-body-container'" ] = true;
			return obj;
		},
		/**
		 * @method panelHeaderBindings
		 * @return {Object}
		 */
		panelHeaderBindings: function() {
			var me = this,
				obj = {
					css: {
						"'panel-heading'": me.panelHeaderClass
					},
					attr: {}
			};
			
			if ( me.headerItems ) {
				obj.css.clearfix = true;
			}
			
			if ( me.role ) {
				obj.attr.role = me.parseBind( me.role );
			}
			
			return obj;
		},
		/**
		 * @method headerItemsBindings
		 * @return {Object}
		 */
		headerItemsBindings: function() {
			var me = this,
				obj = {
					css: {
						"'btn-group'": true
					}
				};
			
			if ( me.headerItemsPosition ) {
				obj.css[ me.parseBind( me.headerItemsPosition ) ] = true;
			}
			
			return obj;
			
		},
		/**
		 * @method collapsibleLinkBindings
		 * @return {Object}
		 */
		collapsibleLinkBindings: function() {
			var me = this,
				id = "fb-ui-collapse-" + me.getId(),
				obj = {
					css: {
						"'fb-ui-title-link'": true
					},
					attr: {
						"'data-toggle'":  "'collapse'",
						"'data-target'":  me.parseBind( "#" + id ),
						"'aria-expanded'": typeof me.collapsed === "boolean" ? me.collapsed : true,
						"'aria-controls'":  me.parseBind( id )
					}
				};
			
			if ( me.dataParentId ) {
				obj.attr[ "'data-parent'" ] = me.dataParentId;
			}
			
			return obj;
		},
		
		/**
		 * @method collapsibleIconBindings
		 * @return {Object}
		 */
		collapsibleIconBindings: function() {
			var me = this,
				obj = {
					css: {
						"'fb-ui-panel-icon'": true,
						"'fb-ui-collapse-icon'": true
					},
					attr: {}
				};
			
			obj.click = "function(){ return Firebrick.ui.helper.callFunction('" + me.getId() + "', '_collapseIconClick', arguments)}";
			
			return obj;
		},
		/**
		 * simulate a click on the icon and delegate it to the title
		 * @method _collapseIconClick
		 * @private
		 * @param obj
		 * @param event {Object} jquery event
		 */
		_collapseIconClick: function( ) {
			var me = this;
			me.toggleCollapse();
		},
		/**
		 * @method maximizableIconBindings
		 * @return {Object}
		 */
		maximizableIconBindings: function() {
			var obj = {
					css: {
						"'fb-ui-panel-icon'": true,
						"glyphicon": true,
						"'glyphicon-fullscreen'": true
					}
				};
			
			return obj;
		},
		/**
		 * @method panelHeaderTextBindings
		 * @return {Object}
		 */
		panelHeaderTextBindings: function() {
			var me = this,
				obj = {
						css: {
							"'panel-title'": me.panelTitleClass
						}
					};
			
			if ( typeof me.title !== "boolean" ) {
				obj.text = me.textBind( "title" );
			}
			
			if ( me.headerItems ) {
				obj.css[ "'pull-left'" ] = true;
			}
			
			if ( me.labelText ) {
				obj.css[ "'fb-ui-has-label'" ] = true;
			}
			
			return obj;
		},
		/**
		 * @method panelBodyBindings
		 * @return {Object}
		 */
		panelBodyBindings: function() {
			var me = this,
				obj = {
					css: {
						"'panel-body'": me.panelBodyClass
					}
				};

			me.toolbarContainer( obj );
			
			return obj;
		},
		/**
		 * @method panelItemBindings
		 * @return {Object}
		 */
		panelItemBindings: function() {
			var me = this,
				obj = {};

			//no items are defined or it is an empty array
			if ( !me.items || ( me.items && !me.items.length ) ) {
				obj.html = "Firebrick.ui.helper.getHtml( '" + me.getId() + "', $data, $context )";
			}
			
			return obj;
		}
	});
});
