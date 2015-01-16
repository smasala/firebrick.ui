/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.table
 * @class Table
 */
define(["jquery", "text!./Table.html", "../common/Base", "datatables", "responsive-tables-js"], function($, tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.table.Table", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-table",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * sets the bootstrap css class "responsive" to the table
		 * @property responsiveClass
		 * @type {Boolean}
		 * @default true
		 */
		responsiveClass:true,
		/**
		 * activates the responsive-table-js package on the table
		 * @property responsive
		 * @type {Boolean}
		 * @default true
		 */
		responsive:true,
		/**
		 * {
		 * 	cols:[{}]
		 * 	rows:[{}]
		 * }
		 * @property data
		 * @type {Object|String}
		 * @default false
		 */
		data:false,
		/**
		 * @property tableStriped
		 * @type {Boolean|String}
		 * @default true
		 */
		tableStriped:true,
		/**
		 * @property tableHover
		 * @type {Boolean|String}
		 * @default false
		 */
		tableHover:false,
		/**
		 * @property tableCondensed
		 * @type {Boolean|String}
		 * @default false
		 */
		tableCondensed:false,
		/**
		 * @property tableBordered
		 * @type {Boolean|String}
		 * @default false
		 */
		tableBordered:false,
		/**
		 * @property showHeadings
		 * @type {Boolean}
		 * @default true
		 */
		showHeadings:true,
		/**
		 * @property showRows
		 * @type {Boolean}
		 * @default true
		 */
		showRows:true,
		/**
		 * activate the datatables plugin
		 * @property datatable
		 * @type {Boolean}
		 * @default false
		 */
		datatable:false,
		/**
		 * activate the treetable plugin
		 * @property treetable
		 * @type {Boolean}
		 * @default false
		 */
		treetable:false,
		/**
		 * return js object to pass to the DataTable function for configuring the table on rendered
		 * @property dataTableConfig
		 * @type {Function}
		 * @return {object}
		 * @default {
		 * 	"language": {
		 *			"paginate": {
		 *				"first": "First",
		 *				"last": "Last",
		 *				"next": "Next",
		 *				"previous": "Previous"
		 *			}
		 *		}
		 * }
		 */
		dataTableConfig: function(){
			return {
				"language": {
					"paginate": {
						"first": "First",
						"last": "Last",
						"next": "Next",
						"previous": "Previous"
					}
				}
			};
		},
		/**
		 * works with parameter treetable
		 * @property expandable
		 * @type {Boolean}
		 * @default true
		 */
		expandable:true,
		/**
		 * works with parameter treetable
		 * @property showCaption
		 * @type {Boolean|String}
		 * @default true
		 */
		showCaption:true,
		/**
		 * works with parameter treetable
		 * @property expandText
		 * @type {String}
		 * @default "Expand"
		 */
		expandText:'Expand',
		/**
		 * works with parameter treetable
		 * @property collapseText
		 * @type {String}
		 * @default "Collapse"
		 */
		collapseText: 'Collapse',
		/**
		 * whether to show the collapse / expand buttons for the treetable
		 * @property showOptions
		 * @type {Boolean}
		 * @default true
		 */
		showOptions: true,
		/**
		 * return js object to pass to the Treetable function for configuring the table on rendered
		 * @property treeTableConfig
		 * @type {Function}
		 * @return {Object}
		 * @default {}
		 */
		treeTableConfig:function(){
			var me = this;
			return {
				expandable:me.expandable
			};
		},
		/**
		 * @method init
		 */
		init:function(){
			var me = this;
			
			me.on("rendered", function(){
				var id = me.getId(),
					table = me.getElement();
				if(me.datatable){
					table.DataTable(me.dataTableConfig());
				}
				if(me.treetable){
					if(me.showOptions){
						$("a#fb-expand-" + id).on("click", me.generateOnclick("expandAll"));
						$("a#fb-collapse-" + id).on("click", me.generateOnclick("collapseAll"));
					}
					table.treetable(me.treeTableConfig());
				}
				if(me.responsive && window.responsiveTables){
					window.responsiveTables.update(id);
				}
			});
			me.callParent(arguments);
		},
		/**
		 * @method containerBindings
		 * @return {Object}
		 */
		containerBindings: function(){
			var me = this;
			return {
				css:{
					"'responsive'": me.responsiveClass
				}
			};
		},
		/**
		 * @method _getData
		 * @private
		 * @return {Object}
		 */
		_getData: function(){
			var me = this;
			if($.isPlainObject(me.data)){
				return "Firebrick.ui.getCmp('" + me.getId() + "').data";
			}
			return me.data;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj["with"] = me._getData();
			obj.css.table = true;
			obj.css["'table-striped'"] = me.tableStriped;
			obj.css["'table-hover'"] = me.tableHover;
			obj.css["'table-condensed'"] = me.tableCondensed;
			obj.css["'table-bordered'"] = me.tableBordered;
			obj.css["'responsive'"] =  me.responsive;
			
			return obj;
		},
		/**
		 * @method theadBindings
		 * @return {Object}
		 */
		theadBindings: function(){
			return {
				"if": "cols" 
			};
		},
		/**
		 * @method theadTRBindings
		 * @return {Object}
		 */
		theadTRBindings:function(){
			return {
				"foreach": "cols"
			};
		},
		/**
		 * @method theadTRTDBindings
		 * @return {Object}
		 */
		theadTRTDBindings:function(){
			return {
				"html": "$data.renderer ? fb.ui.renderer.get($data.renderer)($data, $context, $parent, $root) : ($data.text ? $data.text : $data)"
			};
		},
		/**
		 * @method tbodyBindings
		 * @return {Object}
		 */
		tbodyBindings:function(){
			return {
				"foreach": "rows"
			};
		},
		/**
		 * @method tbodyTRBindings
		 * @return {Object}
		 */
		tbodyTRBindings:function(){
			return {
				"foreach": "$data.cols ? $data.cols : $data",
				"attr":{
					"'data-tt-id'": "$data.id ? $data.id : false",
					"'data-tt-parent-id'": "$data.parentId ? $data.parentId : false"
				}
			};
		},
		/**
		 * @method tbodyTRTDBindings
		 * @return {Object}
		 */
		tbodyTRTDBindings:function(){
			return {
				"html": "$data.renderer ? fb.ui.renderer.get($data.renderer)($data, $context, $parent, $root) : ($data.text ? $data.text : $data)"
			};
		},
		/**
		 * @method captionBindings
		 * @return {Object}
		 */
		captionBindings:function(){
			var me = this;
			return {
				show: me.showCaption
			};
		},
		/**
		 * @method generateOnclick
		 * @param type {String} expandAll, collapseAll
		 * @return {Function}
		 */
		generateOnclick: function(type){
			var me = this;
			return function(){
				me.getElement().treetable(type); 
				return false;
			};
		},
		/**
		 * @method expandBindings
		 * @return {Object}
		 */
		expandBindings:function(){
			var me = this;
			return {
				text: me.textBind( me.expandText ),
				attr:{
					id: me.parseBind("fb-expand-" + me.getId()),
					href:"''"
				}
			};
		},
		/**
		 * @method collapseBindings
		 * @return {Object}
		 */
		collapseBindings:function(){
			var me = this;
			return {
				text: me.textBind( me.collapseText ),
				attr:{
					id: me.parseBind("fb-collapse-" + me.getId()),
					href:"''"
				}
			};
		}
		
	});
});