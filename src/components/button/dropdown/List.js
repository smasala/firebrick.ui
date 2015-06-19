/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * use Button with property "data" and "dropdownConfig:{}"
 * @private
 * @module Firebrick.ui.components
 * @extends components.nav.List
 * @namespace components.button.dropdown
 * @class List
 */
define(["jquery", "../../nav/List"], function($){
	"use strict";
	return Firebrick.define("Firebrick.ui.button.dropdown.List", {
		extend: "Firebrick.ui.nav.List",
		sName:"button.dropdown.list",
		/**
		 * @property ariaLabelledBy
		 * @type {String}
		 * @default ""
		 */
		ariaLabelledBy: "",
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
		},
		
		/**
		 * @method _hasChildren
		 * @param $data {Object|Function} ko binding object
		 * @return {Boolean}
		 */
		_hasChildren: function($data){
			
			if($data){
				if($data.children){
					if($.isFunction($data.children)){
						//return true or false depending on whether length >= 0
						return !!($data.children().length);
					}else{
						if($data.children.length){
							//has children
							return true;
						}
					}
				}
			}
			
			//no children
			return false;
		},
		/**
		 * @method getItemId
		 * @param $data {Object} knockout object
		 * @return {String}
		 */
		getItemId: function( $data ){
			$data.id = $data && $data.id ? $data.id : "fb-ui-item-" + Firebrick.utils.uniqId();
			return $data.id;
		},
		/**
		 * called on each item iteration
		 * @method fbItem
		 * @param $data {Object} knockout object
		 * @param $context {Object} knockout object
		 */
		fbItem: function($data){
			var me = this,
				$el;
			if($data){
				if($data.id){
					me._registerHandler("#" + $data.id, $data.handler, $data.handlerEvent);	
				}
			}
			return true;
		},
		/**
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function(){
			var me = this,
				clazz = "Firebrick.ui.getCmp('" + me.getId() + "')",
				obj = me.callParent(arguments);
			
			obj.attr = obj.attr || {}; 
			
			obj.attr.role = "'presentation'";
			obj.css["'dropdown-submenu'"] = clazz + "._hasChildren($data)";
			obj.attr.id = clazz + ".getItemId( $data )";
			obj.attr._fbItem = clazz + ".fbItem($data, $context)"
			
			return obj;
		},
		/**
		 * @method listLinkBindings
		 * @return {Object}
		 */
		listLinkBindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			obj.attr.role = "'menuitem'";
			obj.attr.tabindex = "-1";
			return obj;
		}
	});
});