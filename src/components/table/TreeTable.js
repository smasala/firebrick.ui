/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.table.Table
 * @namespace components.table
 * @class TreeTable
 */
define(["./Table", "jquery-treetable"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.table.TreeTable", {
		extend:"Firebrick.ui.table.Table",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "table.treetable",
		/**
		 * @property data
		 * @type {Object|String}
		 * @default "''"
		 */
		store:false,
		/**
		 * @property treetable
		 * @type {Boolean}
		 * @default true
		 */
		treetable:true
	});
});