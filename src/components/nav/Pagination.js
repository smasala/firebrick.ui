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
	"use strict";
	return Firebrick.define("Firebrick.ui.nav.Pagination", {
		extend:"Firebrick.ui.display.List",
		sName:"nav.pagination",
		/**
		 * "lg", "sm"
		 * @property paginationSize
		 * @type {String}
		 * @default null
		 */
		paginationSize:null,
		/**
		 * override parent
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			obj.css.pagination = true;
			if(me.paginationSize){
				obj.css[ me.parseBind("pagination-"+me.paginationSize) ] = true;
			}
			return obj;
		}
	});
});