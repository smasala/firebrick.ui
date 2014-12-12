/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Panel
 */
define(["text!./Panel.html", "./Base"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.Panel", {
		extend:"Firebrick.ui.containers.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-panel",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl:tpl,
		/**
		 * @property title
		 * @type {String}
		 * @default ""
		 */
		title:"",
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
		 * @property showPanelHeader
		 * @type {Boolean|String}
		 * @default true
		 */
		showPanelHeader:true,
		/**
		 * fill the panel body (can be html too)
		 * @property content
		 * @type {String}
		 * @default ""
		 */
		content: "",
		/**
		 * whether the content is just text
		 * @property contentTextual
		 * @type {Boolean}
		 * @default true
		 */
		contentTextual: true,
		/**
		 * @property collapsible
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsible:false,
		/**
		 * @property collapsed
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsed:false,
		/**
		 * @property headerIcons
		 * @type {Boolean|Object} boolean = false, if object use the same way as the "items" property
		 * @default false
		 */
		headerIcons: false,
		/**
		 * @property headerIconPosition
		 * @type {String} css class "pull-right", "pull-left" etc
		 * @default "pull-right"
		 */
		headerIconPosition: "pull-right",
		/**
		 * Data bindings
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = {
						css:{
							"panel": me.panelClass
						}
					};
			if(me.panelTypeClass){
				obj.css[ me.parseBind("panel-"+me.panelTypeClass)] = true;
			}
			return obj;
		},
		/**
		 * @method tabBindings
		 * @return {Object}
		 */
		tabBindings: function(){
			var me = this,
				obj = {
					css:{},
					attr:{
						id: me.parseBind( "fb-ui-collapse-" + me.getId() )
					}
			};
			if(me.collapsible){
				obj.css["'panel-collapse'"] = me.collapsible;
				obj.css.collapse = me.collapsible;
				if(!me.collapsed){
					obj.css["in"] = true;
				}
			}
			return obj;
		},
		/**
		 * @method panelHeaderBindings
		 * @return {Object}
		 */
		panelHeaderBindings: function(){
			var me = this,
				obj = {
					css:{
						"'panel-heading'": me.panelHeaderClass
					},
					visible: me.showPanelHeader
				};
			return obj;
		},
		/**
		 * @method headerIconBindings
		 * @return {Object}
		 */
		headerIconBindings: function(){
			var me = this,
				obj= {
					css: {
						"'btn-group'": true
					}
				};
			
			obj.css[me.parseBind(me.headerIconPosition)] = true;
				
			return obj;
			
		},
		/**
		 * @method collapsibleLinkBindings
		 * @return {Object}
		 */
		collapsibleLinkBindings: function(){
			var me = this,
				id = "fb-ui-collapse-" + me.getId();
			return {
				attr:{
					"'data-toggle'":  "'collapse'",
					"href":  me.parseBind("#" + id ),
					"'aria-expanded'": typeof me.collapsed == "boolean" ? me.collapsed : true,
					"'aria-controls'":  me.parseBind( id ),
				}
			};
		},
		/**
		 * @method panelHeaderTextBindings
		 * @return {Object}
		 */
		panelHeaderTextBindings: function(){
			return {
				text: "fb.text('" + this.title + "')"
			};
		},
		/**
		 * @method panelBodyBindings
		 * @return {Object}
		 */
		panelBodyBindings: function(){
			var me = this,
				obj = {
						css:{
							"'panel-body'": me.panelBodyClass
						}
					};
			
			if(!me.items && me.content){
				obj.html = me.contentTextual ? "fb.text('" + me.content + "')" : me.content;
			}
			return obj;
		}
	});
});