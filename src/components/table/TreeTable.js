/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.table.Table
 * @namespace components.table
 * @class TreeTable
 */
define(["jquery", "./Table", "jquery-treetable"], function($){
	return Firebrick.define("Firebrick.ui.table.TreeTable", {
		extend:"Firebrick.ui.table.Table",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-treetable",
		/**
		 * @property data
		 * @type {Object|String}
		 * @default "''"
		 */
		data:"''",
		/**
		 * @property treetable
		 * @type {Boolean}
		 * @default true
		 */
		treetable:true
	});
});