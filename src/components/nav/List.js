/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class List
 */
define( [ "../display/List" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.nav.List", {
		extend: "Firebrick.ui.display.List",
		sName: "nav.list",
		unstyled: true,
		linkedList: true,
		/**
		 * whether navbar-nav class is applied to list
		 * @property navbarNavClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarNavClass: true,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( me.navbarNavClass ) {
				obj.css[ "'navbar-nav'" ] = true;
			}

			obj.css.nav = true;
			
			return obj;
		}
	});
});
