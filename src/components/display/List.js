/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class List
 */
define(["text!./List.html", "../common/Base", "../common/mixins/Badges"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.display.List", {
		extend:"Firebrick.ui.common.Base",
		mixins:"Firebrick.ui.common.mixins.Badges",
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
		 * @property listGroup
		 * @type {Boolean|String}
		 * @default true
		 */
		listGroup:false,
		/**
		 * defaults to true but only comes into effect with property "listGroup"
		 * @property listItemGroupClass
		 * @type {Boolean|String}
		 * @default true
		 */
		listItemGroupClass:true,
		/**
		 * items to parse into the list
		 * @property data
		 * @type {String}
		 * @default null
		 */
		data:null,
		/**
		 * unstyled - applies list-unstyled css class to list container (ul/ol)
		 * @property unstyled
		 * @type {boolean}
		 * @default false
		 */
		unstyled:false,
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
		 * wrap the list element content in a <a></a> link
		 * @property linkedList
		 * @type {Boolean}
		 * @default false
		 */
		linkedList: false,
		/**
		 * @method virtualContainerBindings
		 * @return {Object}
		 */
		virtualContainerBindings: function(){
			return {"if": "$data && $data.length"};
		},
		/**
		 * @method listContainerBindings
		 * @return {Object}
		 */
		listContainerBindings: function(){
			var me = this,
				obj = {css:{}};
			if(me.listGroup){
				obj.css["'list-group'"] = me.listGroup;
			}
			if(me.unstyled){
				obj.css["'list-unstyled'"] = me.unstyled;
			}
			if(me.data){
				obj.foreach = "$data";
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
			
			if(me.listGroup && me.listItemGroupClass){
				obj.css["'list-group-item'"] = me.listItemGroupClass;
			}
			
			obj.css.divider = "$data === '|' || $data.divider ? true : false";

			return obj;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings:function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.text = "$data.text ? $data.text : $data";
			
			return obj;
		},
		
		listTemplateBindings: function(){
			var me = this;
			return {
				template: {
					name:  me.parseBind(me.getId()),
					data: $.isArray(me.data) ? "Firebrick.ui.getCmp('" + me.getId() + "').data" : me.data
				}
			};
		},
		
		childrenBindings: function(){
			var me = this;
			return {
				template: {
					name:  me.parseBind(me.getId()),
					data: "$data.children"
				}
			};
		},
		
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
		}
	});
});