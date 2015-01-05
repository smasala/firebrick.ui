/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.nav.List
 * @namespace components.button.dropdown
 * @class List
 */
define(["../../nav/List"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.button.dropdown.List", {
		extend: "Firebrick.ui.nav.List",
		uiName:"fb-ui-dropdownlist",
		/**
		 * @property ariaLabelledBy
		 * @type {String}
		 * @default ""
		 */
		ariaLabelledBy: "",
		/**
		 * @method listContainerBindings
		 * @return {Object}
		 */ 
		listContainerBindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			obj.css = {
					"'dropdown-menu'": true
			};
			if(!obj.attr){
				obj.attr = {};
			}
			obj.attr.role = "'menu'";
			obj.attr["'aria-labelledby'"] = me.parseBind(me.ariaLabelledBy);
			return obj;
		},
		/**
		 * completely overwrite parent
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function(){
			return {
				role: "'presentation'",
				css:{
					"'dropdown-submenu'" : "$data.children && $data.children().length ? true : false"
				}
			};
		},
		/**
		 * @method listLinkBindings
		 * @return {Object}
		 */
		listLinkBindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			obj.attr.role = "'menuitem'";
			obj.attr.tabindex = "-1";
			return obj;
		}
	});
});