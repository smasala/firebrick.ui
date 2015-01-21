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
		uiName:"fb-ui-dropdownlist",
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
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.attr = obj.attr || {}; 
			
			obj.attr.role = "'presentation'";
			obj.css["'dropdown-submenu'"] = "Firebrick.ui.getCmp('" + me.getId() + "')._hasChildren($data)";
			
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