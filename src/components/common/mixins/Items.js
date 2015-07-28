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
		 * default configuration for direct children - i.e. direct items
		 * @property defaults
		 * @type {Object}
		 * @default null 
		 */
		defaults: 1,
		/**
		 * alignment of its children components
		 * @property itemsAlign
		 * @type {String|null} "center"
		 * @default
		 */
		itemsAlign:null,
		/**
		 * @property items
		 * @type {String|Object|Array of Object}
		 * @default null
		 */
		items:null,
		/**
		 * inject sub items
		 * @method getItems
		 * @return {String} html
		 */
		getItems: function(){
			var me = this,
				r = me._getItems(me.items);
				me.items = r.items;
			return r.html;
		},
		/**
		 * if you are calling _getItems from a nested scope or you want items from a different property other than .items - then use this function
		 * @method _getItemsScoped
		 * @param me {Object} me component class (this)
		 * @param [itemsName] {String}  name of property to get items from
		 * @return {String} html
		 */
		getItemsProp: function(itemsName){
			var me = this, 
				r,
				html = "";
			if(itemsName){
				r = me._getItems(me[itemsName]);
				me[itemsName] = r.items;
				html = r.html;
			}else{
				console.error("invalid function call getItemsProp():", itemsName);
			}
			
			return html;
		},
		/**
		 * use getItems
		 * @private
		 * @method _getItems
		 * @param {Object|Array of Objects} items
		 * @return {Object, Null} object - {html:"", items:[]}
		 */
		_getItems: function(items){
			return Firebrick.ui._populate(items, this);
		}
	});
});