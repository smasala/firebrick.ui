/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class List
 */
define(["doT", "../display/List"], function(tplEngine){
	"use strict";
	return Firebrick.define("Firebrick.ui.nav.List", {
		extend: "Firebrick.ui.display.List", 
		uiName:"fb-ui-navlist",
		unstyled:true,
		linkedList: true,
		/**
		 * if true - att "navbar-btn" class to the button
		 * @property navbarItem
		 * @type {Boolean}
		 * @default false
		 */
		navbarItem: false,
		/**
		 * @method listLinkBindings
		 * @return {Object}
		 */
		listLinkBindings: function(){
			var obj = {
					attr:{
						href: "$data.link ? $data.link : ''"
					}
			};
			return obj;
		},
		/**
		 * @method listContainerBindings
		 * @return {Object}
		 */
		listContainerBindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			if(me.navbarItem){
				obj.css["'navbar-nav'"] = true;
				obj.css.nav = true;
			}
			
			return obj;
		}
	});
});