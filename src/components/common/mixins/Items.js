/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Items
 * @static
 */
define(["jquery"], function($){
	"use strict";
	return Firebrick.define("Firebrick.ui.common.mixins.Items", {
		/**
		 * @property items
		 * @type {String|Object|Array of Object}
		 * @default null
		 */
		items:null,
		listeners:{
			componentReady: function(){
				var me = this,
					items = me.items,
					args = arguments;
				if($.isArray(items)){
					var cmp;
					for(var i = 0, l = items.length; i<l; i++){
						cmp = items[i];
						if(cmp.passEvent){
							cmp.passEvent(args);
						}
					}
				}
			}
		},
		/**
		 * inject sub items
		 * @method getItems
		 * @return {String} html
		 */
		getItems: function(){
			var me = this,
				r = me._getItems(me.items);
			if($.isPlainObject(r)){
				me.items = r.items;
			}
			return r ? r.html || r : "";
		},
		/**
		 * if you are calling _getItems from a nested scope then use this function
		 * @method _getItemsScoped
		 * @param me {Object} me component class (this)
		 * @param [itemsName] {String}  name of property to get items from
		 * @return {String} html
		 */
		getItemsProp: function(itemsName){
			var me = this;
			itemsName = typeof itemsName == "string" ? me[itemsName] : me.items;
			var items = me._getItems(itemsName);
			return items ? items.html || items : "";
		},
		/**
		 * use getItems
		 * @private
		 * @method _getItems
		 * @param {Object} items
		 * @return {Object, Null} object - {html:"", items:[]}
		 */
		_getItems: function(items){
			var me = this;
			if(items){
				if(!$.isArray(items) && !$.isFunction(items)){
					items = [items];
				}
				return Firebrick.ui._populate(items, me);
			}
			return null;
		}
	});
});