/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 *
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers.tab
 * @class Pane
 */
define( [ "text!./Pane.html", "../Base", "bootstrap.plugins/tab" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.tab.Pane", {
		extend: "Firebrick.ui.containers.Base",
		tpl: tpl,
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-tab.pane"
		 */
		sName: "containers.tab.pane",
		/**
		 * @property active
		 * @type {Boolean}
		 * @default false
		 */
		active: false,
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String|Function}
		 * @default ""
		 */
		html: "",
		/**
		 * returns the Tab component, not the TabPane!
		 * @method getTabId
		 * @return {String}
		 */
		getTab: function() {
			return this._parent;
		},
		/**
		 * set by tab
		 * @property paneIndex
		 * @type {integer}
		 * @default 0
		 */
		paneIndex: 0,
		/**
		 * @method getPaneId
		 * @return {String}
		 */
		getPaneId: function() {
			var me = this,
				parent = me.getTab();
			
			return parent.getTabId( me.paneIndex );
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent();
		
			obj.attr.role = "'tabpanel'";
			obj.css[ "'tab-pane'" ] = true;
			obj.css.active = me.active;
			
			obj.attr.id = "Firebrick.getById('" + me.getId() + "').getPaneId()";

			if ( !me.items ) {
				obj.html = "Firebrick.ui.helper.getHtml( '" + me.getId() + "', $data, $context )";
			}
			
			return obj;
		}
	});
});
