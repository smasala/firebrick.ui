/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.nav.Base
 * @namespace components.nav
 * @class Navbar
 */
define(["text!./Navbar.html", "./Base", "./List"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.nav.Navbar", {
		extend:"Firebrick.ui.nav.Base",
		tpl:tpl,
		uiName:"fb-ui-navbar",
		/**
		 * passed on to the toolbar items (direct children only)
		 * @property toolbarDefaults
		 * @type {Object}
		 * @default {Object} {
		 * 		navbarItem: true
		 * }
		 */
		defaults:{
			navbarItem: true
		},
		/**
		 * false to deactivate
		 * @property navTypeClass
		 * @type {Boolean|String} string: navbar-fixed-top, navbar-static-top, navbar-fixed-top, navbar-fixed-bottom, navbar-inverse (navbarDefaultClass=false)
		 * @default "'navbar-static-top'"
		 */
		navTypeClass: "navbar-static-top",
		/**
		 * whether "navbar-default" is used
		 * @property navbarDefaultClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarDefaultClass: true,
		/**
		 * whether "navbar" css class is used
		 * @property navbarClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarClass:true,
		/**
		 * whether "navbar-form" css class is used
		 * @property navbarFormClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarFormClass: true,
		/**
		 * css class: navbar-header
		 * @property navbarHeaderClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarHeaderClass:true, 
		/**
		 * if false then the navigation won't collapse to the small menu button
		 * @property toggleButton
		 * @type {Boolean}
		 * @default true
		 */
		toggleButton: true,
		/**
		 * @property toggleText
		 * @type {String}
		 * @default "Toggle navigation"
		 */
		toggleText: "Toggle navigation",
		/**
		 * @property brandClass
		 * @type {Boolean|String}
		 * @default true
		 */
		brandClass: true,
		/**
		 * false to deactivate
		 * @property brandLink
		 * @type {Boolean|String}
		 * @default "/"
		 */
		brandLink: "/",
		/**
		 * brand text - false to show none or if you wish to use brandTpl instead
		 * @property brandText
		 * @type {Boolean|String}
		 * @default "Firebrick.ui"
		 */
		brandText:"Firebrick.ui",
		/**
		 * false to deactivate
		 * @property brandTpl
		 * @type {Boolean|String}
		 * @default false
		 */
		brandTpl:false,
		/**
		 * data to populate navigation with
		 * @property data
		 * @type {String}
		 * @default null
		 */
		data:null,
		/**
		 * overriding parent
		 * @property listGroupClass
		 * @default false
		 */
		listGroupClass:false,
		/**
		 * sets nav && nav-bar css classes to the list container
		 * @property navClass
		 * @type {String|Boolean}
		 * @default true
		 */
		navClass: true,
		/**
		 * @property showNavbarHeader
		 * @type {Boolean}
		 * @default true
		 */
		showNavbarHeader: true,
		/**
		 * @property showBranding
		 * @type {Boolean}
		 * @default true
		 */
		showBranding: true,
		/**
		 * @method navBindings
		 * @return {Object}
		 */
		navBindings: function(){
			var me = this,
				obj = {
					attr:{
						role: "'navigation'"
					},
					css:{
						"'navbar-default'": me.navbarDefaultClass,
						"navbar": me.navbarClass
					}
			};
			if(me.navTypeClass){
				obj.css[me.parseBind(me.navTypeClass)] = true;
			}
			return obj;
		},
		/**
		 * @method brandBindings
		 * @return {Object}
		 */
		brandBindings: function(){
			var me = this,
				obj = {
					css:{},
					attr:{
						href: me.parseBind(me.brandLink)
					}
				};
			if(me.brandClass){
				obj.css["'navbar-brand'"] = me.brandClass;
			}
			if(me.brandText && !me.brandTpl){
				obj.text = me.parseBind(me.brandText);
			}
			return obj;
		},
		/**
		 * overriding parent
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			obj.text = "$data.text ? $data.text : ''";
			return obj;
		},
		/**
		 * overriding parent
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function(){
			return {
					css: {
						active: "$data.active ? $data.active : false"
					}
				};
		},
		/**
		 * @method navbarHeaderBindings
		 * @return {Object}
		 */
		navbarHeaderBindings: function(){
			var me = this,
				obj = {css:{}};
			if(me.navbarHeaderClass){
				obj.css["'navbar-header'"] = me.navbarHeaderClass;
			}
			return obj;
		},
		/**
		 * @method navbarContainerBindings
		 * @return {Object}
		 */
		navbarContainerBindings: function(){
			var me = this,
				obj = {
						attr:{
							id:  me.parseBind( "fb-nav-" + me.getId() )
						},
						css:{}
					};
			if(me.toggleButton){
				obj.css.collapse = true;
				obj.css["'navbar-collapse'"] = true;
			}
			
			if(me.navbarFormClass){
				obj.css["'navbar-form'"] = true;
			}
			
			return obj;
		},
		/**
		 * @method toggleTextBindings
		 * @return {Object}
		 */
		toggleTextBindings: function(){
			var me = this;
			return {
				text: me.textBind( me.toggleText )
			};
		},
		/**
		 * @method toggleButtonBindings
		 * @return {Object}
		 */
		toggleButtonBindings: function(){
			var me = this,
				id = "fb-nav-" + me.getId() + "'",
				obj = {
					attr:{
						type: "'button'",
						"'data-toggle'": "'collapse'",
						"'data-target'": "'#" + id,
						"'aria-expanded'": false,
						"'aria-controls'": "'" + id
					},
					css:{
						collapsed: true,
						"'navbar-toggle'": true
					}
				};
			
			return obj;
		},
		/**
		 * @method navbarWrapperBindings
		 * @return {Object}
		 */
		navbarWrapperBindings: function(){
			return {
				css:{
					"container": true
				}
			};
		}
	});
});