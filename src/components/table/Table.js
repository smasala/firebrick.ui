/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @author Steven Masala [me@smasala.com]
 * @module ui.components
 * @extends ui.components.common.Base
 * @namespace ui.components.table
 * @class Table
 */
define(["jquery", "text!./Table.html", "../common/Base", "datatables"], function($, tpl){
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
		 * return js object to pass to the DataTable function for configuring the table on componentReady
		 * @property dataTableConfig
		 * @type {Function}
		 * @return {object}
		 * @default {}
		 */
		dataTableConfig: function(){
			return {};
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
		 * return js object to pass to the Treetable function for configuring the table on componentReady
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
			me.on("componentReady", function(){
				var table = $("#" + me.getId());
				if(me.datatable){
					table.DataTable(me.dataTableConfig());
				}
				if(me.treetable){
					table.treetable(me.treeTableConfig());
				}
			}),
			me.callParent();
		},
		/**
		 * @method containerBindings
		 * @return {Object}
		 */
		containerBindings: function(){
			var me = this;
			return {
				css:{
					"'responsive'": me.responsive
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
				return JSON.stringify(me.data);
			}
			return me.data;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this;
			return {
				"with": me._getData(),
				css:{
					"'table'": true,
					"'table-striped'": me.tableStriped,
					"'table-hover'": me.tableHover,
					"'table-condensed'": me.tableCondensed,
					"'table-bordered'": me.tableBordered
				}
			}
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
		 * @method tbodyBindings
		 * @return {Object}
		 */
		tbodyBindings:function(){
			return {
				"if": "rows"
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
				"text": "$data"
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
				"text": "$data.text ? $data.text : $data"
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
		 * @method expandBindings
		 * @return {Object}
		 */
		expandBindings:function(){
			var me = this;
			return {
				text: "fb.text('"+ me.expandText +"')",
				attr:{
					onclick: "\"$('#" + me.getId() + "').treetable('expandAll'); return false;\"",
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
				text: "fb.text('"+ me.collapseText +"')",
				attr:{
					onclick: "\"$('#" + me.getId() + "').treetable('collapseAll'); return false;\"",
					href:"''"
				}
			};
		}
		
	});
});