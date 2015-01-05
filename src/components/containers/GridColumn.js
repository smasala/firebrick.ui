/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class GridColumn
 */
define(["text!./GridColumn.html", "./Base"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.GridColumn", {
		extend:"Firebrick.ui.containers.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-gridcol",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl:tpl,
		/**
		 * @property deviceSize
		 * @type {String}
		 * @default "md"
		 */
		deviceSize:"md",
		/**
		 * auto will attempt to provide the column width by dividing the number of items in the parent Grid by 12 - decimals will be rounded down
		 * @property columnWidth
		 * @type {Int|String} number 1 to 12 or "auto"
		 * @default "auto"
		 */
		columnWidth:"auto",
		/**
		 * when property columnWidth is set to "auto", this function will attempt to calculate the correct size for each column.
		 * Note: this function will round down to the nearest whole number - 5 columns will result in size 2 for each column
		 * the number of columns are divided by 12 (BS3 grid)
		 * @method _getColumnWidth
		 * @private
		 * @return {Int}
		 */
		_getColumnWidth:function(){
			var me = this,
				colWidth = me.columnWidth;
			if(colWidth === "auto"){
				return Math.floor(12/me._parent.items.length);
			}
			return colWidth;
		},
		
		/**
		 * Bindings
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.css.col = true;
			obj.css["'col-"+me.deviceSize+"-"+me._getColumnWidth()+"'"] = true;
			
			return obj;
		}
	});
});