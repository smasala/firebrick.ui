/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @private
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.menu
 * @class Menu
 */
define(["text!./Menu.html", "jquery", "../common/Base", "../common/mixins/Items", "./Item"], function(tpl, $){
	"use strict";
	
	return Firebrick.define("Firebrick.ui.menu.Menu", {
		extend: "Firebrick.ui.common.Base",
		mixins:"Firebrick.ui.common.mixins.Items",
		/**
		 * @property sName
		 * @type {String}
		 * @default "menu.list",
		 */
		sName:"menu.menu",
		/**
		 * @property tpl
		 */
		tpl: tpl,
		/**
		 * @property defaults
		 * @type {object}
		 * @default {
		 * 		sName: "menu.item"
		 * }
		 */
		defaults: {
			sName: "menu.item"
		},
		/**
		 * @property ariaLabelledBy
		 * @type {String}
		 * @default ""
		 */
		ariaLabelledBy: "",
		/**
		 * @method init
		 */
		init: function(){
			var me = this;
			
			me._prepItems();
			
			return me.callParent( arguments );
		},
		/**
		 * @method _prepItems
		 * @private
		 */
		_prepItems: function(){
			var me = this,
				it,
				items = me.items;
			
			for(var i = 0, l = items.length; i<l; i++){
				it = items[i];
				if(it === "|"){
					it = {
						divider: true
					}
				}else if( it.sName && it.sName !== "menu.item"){
					it = {
							items: [ items[i] ]
					}
				}
				
				items[i] = it;
			}
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */ 
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			obj.css = {
					"'dropdown-menu'": true
			};
			if(!obj.attr){
				obj.attr = {};
			}
			obj.attr.role = "'menu'";
			obj.attr["'aria-labelledby'"] = me.parseBind(me.ariaLabelledBy);

			return obj;
		}
	});
});