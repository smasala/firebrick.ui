/**
 * Extends: {{#crossLink "Firebrick.ui.components.table.Table"}}{{/crossLink}}
 * @module Firebrick.ui.components
 * @extends Firebrick.ui.components.table.Table
 * @namespace Firebrick.ui.components.table
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