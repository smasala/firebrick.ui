define(["jquery", "text!./Table.html", "../common/Base", "datatables"], function($, tpl){
	return Firebrick.define("Firebrick.ui.table.Table", {
		extend:"Firebrick.ui.common.Base",
		uiName: "fb-ui-table",
		tpl: tpl,
		/**
		 * @type boolean
		 */
		responsive:true,
		/**
		 * @type json object || string 
		 * {
		 * 	cols:[{}]
		 * 	rows:[{}]
		 * }
		 */
		data:false,
		/**
		 * @type boolean or string
		 */
		tableStriped:true,
		/**
		 * @type boolean or string
		 */
		tableHover:false,
		/**
		 * @type boolean or string
		 */
		tableCondensed:false,
		/**
		 * @type boolean or string
		 */
		tableBordered:false,
		/**
		 * @type boolean
		 */
		showHeadings:true,
		/**
		 * @type boolean
		 */
		showRows:true,
		/**
		 * @type boolean
		 * activate the datatables plugin
		 */
		datatable:false,
		/**
		 * @type boolean
		 * activate the treetable plugin
		 */
		treetable:false,
		/**
		 * @type object
		 * return js object to pass to the DataTable function for configuring the table on componentReady
		 */
		dataTableConfig: function(){
			return {};
		},
		/**
		 * @type boolean
		 * works with parameter treetable
		 */
		expandable:true,
		/**
		 * @type boolean or string
		 * works with parameter treetable
		 */
		showCaption:true,
		/**
		 * @type string
		 * works with parameter treetable
		 */
		expandText:'Expand',
		/**
		 * @type string
		 * works with parameter treetable
		 */
		collapseText: 'Collapse',
		
		/**
		 * @type object
		 * return js object to pass to the Treetable function for configuring the table on componentReady
		 */
		treeTableConfig:function(){
			var me = this;
			return {
				expandable:me.expandable
			};
		},
		
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
		
		containerBindings: function(){
			var me = this;
			return {
				css:{
					"'responsive'": me.responsive
				}
			};
		},
		
		/**
		 * @private
		 */
		_getData: function(){
			var me = this;
			if($.isPlainObject(me.data)){
				return JSON.stringify(me.data);
			}
			return me.data;
		},
		
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
		
		theadBindings: function(){
			return {
				"if": "cols" 
			};
		},
		
		tbodyBindings:function(){
			return {
				"if": "rows"
			};
		},
		
		/**
		 * loop bindings
		 */
		theadTRBindings:function(){
			return {
				"foreach": "cols"
			};
		},
		
		theadTRTDBindings:function(){
			return {
				"text": "$data"
			};
		},
		
		tbodyBindings:function(){
			return {
				"foreach": "rows"
			};
		},
		
		tbodyTRBindings:function(){
			return {
				"foreach": "$data.cols ? $data.cols : $data",
				"attr":{
					"'data-tt-id'": "$data.id ? $data.id : false",
					"'data-tt-parent-id'": "$data.parentId ? $data.parentId : false"
				}
			};
		},
		
		tbodyTRTDBindings:function(){
			return {
				"text": "$data.text ? $data.text : $data"
			};
		},
		
		captionBindings:function(){
			var me = this;
			return {
				show: me.showCaption
			};
		},
		
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