/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class Pagination
 */
define(["../display/List"], function(){
	return Firebrick.define("Firebrick.ui.display.Pagination", {
		extend:"Firebrick.ui.display.List",
		uiName:"fb-ui-pagination",
		/**
		 * "lg", "sm"
		 * @property paginationSize
		 * @type {String}
		 * @default null
		 */
		paginationSize:null,
		/**
		 * override from parent
		 * @method listContainerBindings
		 * @return {Object}
		 */
		listContainerBindings: function(){
			var me = this,
				obj = this.callParent();
			obj.css.pagination = true;
			if(me.paginationSize){
				obj.css[ me.parseBind("pagination-"+me.paginationSize) ] = true;
			}
			return obj;
		}
	});
});