/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Panel
 */
define(["text!./Panel.html", "./Base", "../nav/Toolbar", "../common/mixins/Toolbars"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.Panel", {
		extend:"Firebrick.ui.containers.Base",
		mixins:"Firebrick.ui.common.mixins.Toolbars",
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
		 * @type {String|false} set to false to hide the title
		 * @default ""
		 */
		title:"",
		/**
		 * use to determine whether h1, h2, h3 etc - default = 3
		 * @property headerSize
		 * @type {Int}
		 * @default 3
		 */
		headerSize:3,
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
		 * fill the panel body (can be html too) - use in conjunction with contentHTML property
		 * @property content
		 * @type {String}
		 * @default ""
		 */
		content: "",
		/**
		 * whether the content is html content
		 * @property contentHTML
		 * @type {Boolean}
		 * @default false
		 */
		contentHTML: false,
		/**
		 * @property collapsible
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsible:false,
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
		collapsed:false,
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
		 * @method init
		 * @return {Object}
		 */
		init: function(){
			var me = this;
			
			me.on("rendered", function(){
				var panel = me.getElement();
				if(me.collapsed){
					panel.addClass( me._collapsedClass );
				}
			});
			
			return me.callParent(arguments);
		},
		/**
		 * Data bindings
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);

			obj.css.panel = me.panelClass;

			if(me.panelTypeClass){
				obj.css[ me.parseBind("panel-" + me.panelTypeClass) ] = true;
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
			obj.css["'fb-ui-panel-body-container'"] = true;
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
					}
			};
			
			if(me.headerItems){
				obj.css.clearfix = true;
			}
			
			return obj;
		},
		/**
		 * @method headerItemsBindings
		 * @return {Object}
		 */
		headerItemsBindings: function(){
			var me = this,
				obj= {
					css: {
						"'btn-group'": true
					}
				};
			
			if(me.headerItemsPosition){
				obj.css[me.parseBind(me.headerItemsPosition)] = true;
			}
			
			if(me.collapsible && me.showCollapseIcon){
				obj.css["'fb-ui-collapse-icon-present'"] = true;
			}
				
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
				css:{
					"'fb-ui-title-link'": true
				},
				attr:{
					"'data-toggle'":  "'collapse'",
					"href":  me.parseBind("#" + id ),
					"'aria-expanded'": typeof me.collapsed === "boolean" ? me.collapsed : true,
					"'aria-controls'":  me.parseBind( id ),
				},
				click: "function(){ return Firebrick.ui.helper.callFunction('"+me.getId()+"', '_collapseTitleClick', arguments); }"
			};
		},
		
		/**
		 * registered collapsibleLinkBindings with the KO "click" attribute 
		 * @method _collapseTitleClick
		 * @event "fb-ui-panel-state-change" on panel element
		 * @param obj
		 * @param event {Object} jquery event
		 */
		_collapseTitleClick: function(obj, event){
			var me = this,
				title = $(event.target),
				panel = title.closest(".panel");
			
			panel.toggleClass( me._collapsedClass );
			panel.trigger("fb-ui-panel-state-change");
		},
		
		/**
		 * @method collapsibleIconBindings
		 * @return {Object}
		 */
		collapsibleIconBindings: function(){
			var me = this,
				obj = {css:{}, attr:{}};
			
			obj.css["'fb-ui-collapse-icon'"] = true;
			
			if(me.headerItems){
				obj.css["'fb-ui-header-items-present'"] = true;
			}
			
			obj.click = "function(){ return Firebrick.ui.helper.callFunction('"+me.getId()+"', '_collapseIconClick', arguments)}";
			
			return obj;
		},
		
		/**
		 * simulate a click on the icon and delegate it to the title
		 * @method collapseIconClick
		 * @private
		 * @param obj
		 * @param event {Object} jquery event
		 */
		_collapseIconClick: function(obj, event){
			var icon = $(event.target),
				collapse = icon.siblings(".fb-ui-title-link");
			
			//simulate click on the link
			collapse[0].click();
		},
		/**
		 * @method panelHeaderTextBindings
		 * @return {Object}
		 */
		panelHeaderTextBindings: function(){
			var me = this,
				obj = {
						text: me.textBind(me.title),
						css:{
							"'panel-title'": me.panelTitleClass
						}
					};
			
			if(me.headerItems){
				obj.css["'pull-left'"] = true;
			}
			
			return obj;
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
				obj.html = me.contentHTML ? me.content : me.textBind(me.content);
			}
			
			me.toolbarContainer(obj);
			
			return obj;
		},
	});
});