/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class List
 */
define(["text!./List.html", "knockout", "jquery", "../common/Base",  "../common/mixins/Items", "../common/mixins/Badges"], function(tpl, ko, $){
	"use strict";
	
	if(!ko.bindingHandlers.listRenderer){
		/*
		 * optionsRenderer for togglebuttons
		 * create dynamic css along with static
		 */
		ko.virtualElements.allowedBindings.listRenderer = true;
		ko.bindingHandlers.listRenderer = {
		    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		    	var childNodes = ko.virtualElements.childNodes(element),
		    		node,
		    		ul;

		    	for(var i = 0, l = childNodes.length; i<l; i++){
		    		node = childNodes[i];
		    		if(node instanceof HTMLUListElement){
		    			//list item
		    			$(node).attr("id", valueAccessor())
		    		}
		    	}
		    	
		    }
		};
	}
	
	return Firebrick.define("Firebrick.ui.display.List", {
		extend:"Firebrick.ui.common.Base",
		mixins:["Firebrick.ui.common.mixins.Items", "Firebrick.ui.common.mixins.Badges"],
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
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);

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
		 * @method listItemTextBindings
		 * @return {Object}
		 */
		listItemTextBindings:function(){
			//var me = this;
			return {
				text: "$data.text ? $data.text : $data"
			};
		},
		
		/**
		 * @method listTemplateBindings
		 * @return {Object}
		 */
		listTemplateBindings: function(){
			var me = this;
			return {
				template: {
					name:  me.parseBind(me._getTplId()),
					data: $.isArray(me.data) ? "Firebrick.ui.getCmp('" + me.getId() + "').data" : me.data,
				},
				listRenderer: me.parseBind(me.getId())
			};
		},
		
		/**
		 * @private
		 * @method _getTplId
		 * @return {String}
		 */
		_getTplId: function(){
			return "fb-ui-tpl-" + this.getId(); 
		},
		
		/**
		 * @method childrenBindings
		 * @return {Object}
		 */
		childrenBindings: function(){
			var me = this;
			return {
				template: {
					name:  me.parseBind(me._getTplId()),
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
						href: "typeof $data.link === 'string' ? $data.link : '#'"
					}
			};
			obj.attr["'data-target'"] = "$data.dataTarget ? $data.dataTarget : false";
			return obj;
		}
	});
});