/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class TabPanel
 */
define(["text!./TabPanel.html", "./Base", "bootstrap.plugins/tab", "./tab/Pane"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.TabPanel", {
		extend:"Firebrick.ui.containers.Base",
		tpl: tpl,
		/**
		* @property uiName
		* @type {String}
		* @default "fb-ui-tabpanel"
		*/
		uiName: "fb-ui-tabpanel",
		/**
		 * @private
		 * @method _getListTplId
		 * @return {String}
		 */
		_getListTplId: function(){
			return "fb-ui-tpl-list-" + this.getId(); 
		},
		/**
		 * @private
		 * @method _getTabPaneTplId
		 * @return {String}
		 */
		_getTabPaneTplId: function(){
			return "fb-ui-tpl-tabpane-" + this.getId(); 
		},
		/**
		 * @property _tabs
		 * @private
		 * @type {Array}
		 * @default null
		 */
		_tabs: null,
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {
				uiName:fb.ui.cmp.tabpane
			}
		 */
		defaults:{
			uiName:fb.ui.cmp.tab.pane
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent();
			
			obj.attr.role = "'tabpanel'";
			
			return obj;
		},
		/**
		 * @method listTemplateBindings
		 * @return {Object}
		 */
		listTemplateBindings: function(){
			var me = this,
				obj = {};
			
			obj.template = {
					name: me.parseBind( me._getListTplId() ),
					foreach: Firebrick.ui.helper.tabBuilder(me.getId()),
					as:"'tab'"
			};
			
			return obj;
		},
		/**
		 * @method listBindings
		 * @return {Object}
		 */
		listBindings: function(){
			var me = this,
				obj = {css:{}, attr:{}};
			
			obj.attr.role = "'tablist'";
			obj.css.nav = true;
			obj.css["'nav-tabs'"] = true;
			
			return obj;
		},
		/**
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function(){
			var me = this,
				obj = {css:{}, attr:{}};
			
			obj.attr.role = "'presentation'";
			obj.css.active = "tab.hasOwnProperty('active') ? tab.active : false";
			
			return obj;
		},
		/**
		 * @method listItemLinkBindings
		 * @return {Object}
		 */
		listItemLinkBindings: function(){
			var me = this,
				obj = {css:{}, attr:{}};
			
			obj.attr.href = "Firebrick.ui.helper.linkBuilder(tab)";
			obj.attr["'aria-controls'"] = "tab.id";
			obj.attr["'data-target'"] = "Firebrick.getById('"+me.getId()+"').registerTab(tab.id, $index)";
			obj.attr.role = "'tab'";
			obj.attr["'data-toggle'"] = "'tab'";
			
			
			return obj;
		},
		/**
		 * @method listItemTextBindings
		 * @return {Object}
		 */
		listItemTextBindings: function(){
			var me = this,
				obj = {css:{}, attr:{}};
			
			obj.text = me.textBind("'+tab.title+'");
			
			return obj;
		},
		
		/**
		 * @method tabContentBindings
		 * @return {Object}
		 */
		tabContentBindings: function(){
			var me = this,
				obj = {css:{}, attr:{}};
			
			obj.css["'tab-content'"] = true;
			
			return obj;
		},
		
		/**
		 * @method registerTab
		 * @param tabId {String} optional - generates one if not supplied
		 * @param index {Integer}
		 * @return "#{id}"
		 */
		registerTab: function(tabId, index){
			var me = this, 
				id;
			
			if($.isFunction(index)){
				index = index();
			}
			
			id = tabId || "fb-ui-tab-" + me.getId() + "-" + index;
			
			me.addTab(id);
			
			return "#" + id;
		},
		
		/**
		 * @method addTab
		 * @param id {String}
		 * @return self
		 */
		addTab: function(id){
			var me = this;
			if(!me._tabs){
				me._tabs = [];
			}
			me._tabs.push(id);
			return me;
		},
		
		/**
		 * returns tab id at index position
		 * @method getTabId
		 * @param index {Integer}
		 * @return {String}
		 */
		getTabId: function(index){
			return this._tabs[index];
		},
		
		/**
		 * used when calling {{{getTabPaneItem}}} in template
		 * @method getTabPaneItem
		 * @param {Int} iteration index
		 * @param {Object} iteration object
		 * @param {Context} iteration context
		 * @return {String}
		 */
		getTabPaneItem: function(index, item){
			var me = this,
				newItem;
			
			item.paneIndex = index;
			
			newItem = me._getItems(item);
			
			if(newItem){
				//replace items with the new object - _getItems returns an object {html:"", items:[]}
				me.items[index] = newItem.items[0];
				
				return newItem.html;
			}
			return "";
		}
	});
});