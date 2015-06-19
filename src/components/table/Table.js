/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.table
 * @class Table
 */
define(["knockout-mapping", "jquery", "text!./Table.html", "../common/Base", "datatables", "responsive-tables-js", "./plugins/EditableTable"], function(kom, $, tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.table.Table", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-table"
		 */
		sName: "table.table",
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
		 * @property editType
		 * @type {String} row|cell
		 * @default "row"
		 */
		editType:"row",
		/**
		 * @property columns
		 * @type {Array of Objects}
		 * @default null
		 */
		columns:null,
		/**
		 * @property tdSpanClass
		 * @type {String}
		 * @default "fb-ui-tablecell-data"
		 */
		tdSpanClass: "fb-ui-tablecell-data",
		/**
		 * @property tableStriped
		 * @type {Boolean|String}
		 * @default true
		 */
		tableStriped:true,
		/**
		 * @property tableHover
		 * @type {Boolean|String}
		 * @default true
		 */
		tableHover:true,
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
		 * activate the editable table plugin
		 * @property editabletable
		 * @type {Boolean}
		 * @default false
		 */
		editabletable:false,
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
		 * this is the very config that is used to configure the modal that is shown for editing a record - use the properties of Firebrick.ui.containers.Modal
		 * @example
		 * 		{
		 * 			_showEditButtons: true|false //controls whether the footer buttons are shown [default=true]
		 * 			_editOkText: "OK" // [default="OK"] only if _showEditButtons === true
		 * 			_editCancelText: "Cancel" // [default="Cancel"] only if _showEditButtons === true
		 * 		}
		 * @event beforeChanges, afterChanges
		 * @property editModalConfig
		 * @type {Object}
		 * @default null
		 */
		editModalConfig: null,
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
				expandable: me.expandable,
				expanderTemplate: '<a class="glyphicon" href="javascript:void();">&nbsp;</a>'
			};
		},
		/**
		 * @method init
		 */
		init:function(){
			var me = this;
			
			me.data = kom.fromJS(me.data); 
			
			me.on("rendered", function(){
				var id = me.getId(),
					table = me.getElement();
				if(me.datatable){
					table.DataTable(me.dataTableConfig());
				}
				if(me.editabletable){
					table.EditableTable();
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
			if(me.store && me.store.isStore){
				return "Firebrick.ui.getCmp('" + me.getId() + "').getData()";
			}
			return {};
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
			var me = this,
				obj = {
					"if": false
				};
			
			if(me.columns){
				obj["if"] = true;
			}
			
			return obj;
		},
		/**
		 * @method theadTRBindings
		 * @return {Object}
		 */
		theadTRBindings:function(){
			return {
				"foreach": "Firebrick.getById('" + this.getId() + "').columns"
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
				"foreach": "$data"
			};
		},
		/**
		 * @method tbodyTRBindings
		 * @return {Object}
		 */
		tbodyTRBindings:function(){
			return {
				"foreach": "$data.row ? $data.row : $data",
				"attr":{
					"'data-tt-id'": "$data.id ? $data.id : $index",
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
				"attr":{
					"'data-tt-id'": "$data.id ? $data.id : $index",
					"'fb-ui-row-id'": "$data.rowId ? $data.rowId : $parentContext.$index"
				}
			};
		},
		/**
		 * @method tbodyTRTDSpanBindings
		 * @return {Object}
		 */
		tbodyTRTDSpanBindings: function(){
			var me = this,
				obj = {
					css: {},
					html: "$data.renderer ? fb.ui.renderer.get($data.renderer)($data, $context, $parent, $root) : ($data.value ? $data.value : $data)"
				};
			
			obj.css[me.parseBind( me.tdSpanClass )] = true;
			
			return obj;
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