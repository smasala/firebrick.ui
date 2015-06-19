/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.nav.Navbar
 * @namespace components.nav
 * @class Toolbar
 */
define(["./Navbar"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.nav.Toolbar", {
		extend:"Firebrick.ui.nav.Navbar",
		sName:"nav.toolbar",
		showBranding:false,
		/**
		 * possible positions: top, bottom
		 * @property position
		 * @type {String}
		 * @default "top"
		 */
		position: "top",
		init:function(){
			var me = this;
			
			me.navTypeClass = "navbar-fixed-" + me.position;
			
			return me.callParent(arguments);
		},
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.css["'fb-ui-toolbar'"] = true;
			
			return obj;
		},
		navbarContainerBindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.css["'navbar-nav'"] = false;
			obj.css["'fb-ui-navbar'"] = true;
			obj.css["'form-horizontal'"] = true;
			
			return obj;
		},
		/**
		 * @method navbarWrapperBindings
		 * @return {Object}
		 */
		navbarWrapperBindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			if(obj.css.container){
				delete obj.css.container;
			}
			
			obj.css["'container-fluid'"] = true;
			
			return obj;
		}
	});
});