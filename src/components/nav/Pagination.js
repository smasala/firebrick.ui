/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module ui.components
 * @extends ui.components.display.List
 * @namespace ui.components.nav
 * @class Pagination
 */
define(["../display/List"], function(){
	return Firebrick.create("Firebrick.ui.display.Pagination", {
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
				obj.css["'pagination-"+me.paginationSize+"'"] = true;
			}
			return obj;
		}
	});
});