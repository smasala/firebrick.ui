/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class List
 */
define(["text!./List.html", "../common/Base"], function(tpl){
	return Firebrick.define("Firebrick.ui.display.List", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @property uiName
		 * @type {String}
		 * @default "fb-ui-list"
		 */
		uiName:"fb-ui-list",
		/**
		 * @property tpl
		 * @type {String} html
		 * @default components/display/List.html
		 */
		tpl:tpl,
		/**
		 * type of list, ul or ol
		 * @property listType
		 * @type {String}
		 * @default "ul"
		 */
		listType:"ul",
		/**
		 * is a list group?
		 * @property listGroupClass
		 * @type {Boolean|String}
		 * @default true
		 */
		listGroupClass:false,
		/**
		 * defaults to true but only comes into effect with property "listGroupClass"
		 * @property listItemGroupClass
		 * @type {Boolean|String}
		 * @default true
		 */
		listItemGroupClass:true,
		/**
		 * items to parse into the list
		 * @property data
		 * @type {String}
		 * @default false
		 */
		data:false,
		/**
		 * inject a template into the <li>{preItemTpl}<span></span>{postItemTpl}</li> item
		 * @property preItemTpl
		 * @type {String|Function} html
		 * @default ""
		 */
		preItemTpl:"",
		/**
		 * inject a template into the <li>{preItemTpl}<span></span>{postItemTpl}</li> item
		 * @property postItemTpl
		 * @type {String|Function} html
		 * @default ""
		 */
		postItemTpl:"",
		/**
		 * @method listContainerBindings
		 * @return {Object}
		 */
		listContainerBindings: function(){
			var me = this,
				obj = {css:{}};
			if(me.listGroupClass){
				obj.css["'list-group'"] = me.listGroupClass
			}
			if(me.data){
				obj.foreach = "$data"
			}
			return obj;
		},
		/**
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function(){
			var me  = this,
				obj = {css:{}};
			
			if(me.listGroupClass && me.listItemGroupClass){
				obj.css["'list-group-item'"] = me.listItemGroupClass
			}

			return obj;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings:function(){
			var me = this, 
				obj = {};
				obj.text = "$data.text ? $data.text : $data";
			return obj;
		},
		
		listTemplateBindings: function(){
			var me = this;
			return {
				template: {
					name: "'"+me.getId()+"'",
					data: me.data
				}
			}
		},
		
		childrenBindings: function(){
			var me = this;
			return {
				visible: "$data.children ? $data.children : false",
				template: {
					name: "'"+this.getId()+"'",
					data: "$data.children"
				}
			}
		}
	})
});