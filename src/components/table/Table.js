/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.table
 * @class Table
 */
define(["knockout", "knockout-mapping", "jquery", "doT", "text!./Table.html", "text!./tpls/checkbox.html", "../common/Base", "datatables", "jquery-treetable", "responsive-tables-js", "./plugins/EditableTable"], function(ko, kom, $, doT, tpl, checkboxTpl){
	"use strict";
	
	if(!ko.bindingHandlers.trRenderer){
		/*
		 * optionsRenderer for list
		 * create dynamic css along with static
		 */
		ko.virtualElements.allowedBindings.trRenderer = true;
		ko.bindingHandlers.trRenderer = {
		    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		    	var clazz = valueAccessor(),
		    		propName = clazz.propDataName,
		    		$el = $( element );
		    	
		    	$el.prop(propName, viewModel);
		    }
		};
	}
	
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
		 * @example
		 * 
		 * columns: [{
		 * 		mapping:  {String} dot notation to property in store json
		 * 		type: {String} [default=input] | number, float, checkbox, date - used to format the value or run a default renderer
		 * 		format: {String} - used to format the type if needed. Example for type=date - format YYYY-MM-DD
		 * 		editable: {Boolean} [default=true] - specify whether the cells in this column should be editable. Only valid if the table's editabletable is also set to true
		 * 		editConf: {Object} used to configure the Editable table plugin - see Plugin for configuration
		 * 		text: {String} column title (<th></th>)
		 * 		renderer: {Function} define this to parse the value before it is display and output "anything" you like - for example to convert an String value into an <img> tag. data-bind attributes on dynamic created elements work here too
		 * 							 arguments passed are -> (columnConfig, koValue, rawValue)
		 * }]
		 * 
		 * 
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
		 * activate the editable table plugin
		 * @property editabletable
		 * @type {Boolean}
		 * @default false
		 */
		editabletable:false,
		/**
		 * which property the data of the tr is stored to the element
		 * @property propDataName
		 * @type {String}
		 * @default "fb-ui-tr-data"
		 */
		propDataName: "fb-ui-tr-data",
		/**
		 * use option to enable and configure datable: http://datatables.net/examples/index
		 * @property datatable
		 * @type {Boolean|Object|Function (return Object) }
		 * @default false
		 */
		datatable: false,
		/**
		 * default datatable configurations
		 * @property _datatable
		 * @type {Object|Function (return Object) }
		 * @default {}
		 */
		_datatable: {},
		/**
		 * works with parameter treetable
		 * @property expandable
		 * @type {Boolean}
		 * @default true
		 */
		expandable:true,
		/**
		 * set the initialState property of the tree table plugin
		 * @property expanded
		 * @type {Boolean}
		 * @default false
		 */
		expanded: false,
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
		 * @method _itemId
		 * @private
		 * @type {Integer}
		 * @default 0
		 */
		_itemId: 0,
		/**
		 * configuration: http://ludo.cubicphuse.nl/jquery-treetable/
		 * @property treetable
		 * @type {Boolean|Object|Function (return Object)}
		 * @default false
		 */
		treetable: false,
		/**
		 * default treetable configuration
		 * @property _treetable
		 * @private
		 * @type {Object|Function (return Object) }
		 * @return {Object}
		 * @default {}
		 */
		_treetable: function(){
			var me = this;
			return {
				expandable: me.expandable,
				initialState: me.expanded ? "expanded" : "collapsed",
				expanderTemplate: '<a class="glyphicon">&nbsp;</a>'
			};
		},
		/**
		 * used to cache a ko computed observable by _allCheckedObservable()
		 * @property _allCheckedObservableProp
		 * @private
		 * @type {KO Computed}
		 * @default null
		 */
		_allCheckedObservableProp: null, 
		/**
		 * @method init
		 */
		init:function(){
			var me = this;
			
			me.data = kom.fromJS(me.data); 
			
			me.on("rendered", function(){
				var id = me.getId(),
					table = me.getElement();
				if(me.datatable && !me.treetable){
					me._preTableConfig("datatable");
					table.dataTable( me.datatable );
				}
				
				if(me.editabletable){
					table.EditableTable();
				}
				
				if(me.treetable){
					if(me.showOptions){
						$("a#fb-expand-" + id).on("click", me.generateOnclick("expandAll"));
						$("a#fb-collapse-" + id).on("click", me.generateOnclick("collapseAll"));
					}
					me._preTableConfig("treetable");
					table.treetable( me.treetable );
				}
				if(me.responsive && window.responsiveTables){
					window.responsiveTables.update(id);
				}
			});
			me.callParent(arguments);
		},
		/**
		 * used by _preTableConfig
		 * @method __preTableConfig
		 * @param propName {String}
		 * @private
		 * @return {self}
		 */
		__preTableConfig: function( propName ){
			var me = this,
				prop = me[propName];
			if( !$.isPlainObject(prop) && !$.isFunction(prop) ){
				prop = {};
			}
			if( $.isFunction( me[propName] ) ){
				prop = prop.apply(me);
			}
			me[propName] = prop;
			return me;
		},
		/**
		 * 
		 * @method _preTableConfig
		 * @param propName {String}
		 * @private
		 * @return {self}
		 */
		_preTableConfig: function( propName ){
			var me = this,
				defaultProp = "_" + propName;
			me.__preTableConfig( propName );
			me.__preTableConfig( defaultProp );
			me[propName] = Firebrick.utils.copyover( me[propName], me[defaultProp] );
			return me;
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
				return "Firebrick.getById('" + me.getId() + "').getData()";
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
			var me = this;
			return {
				htmlWithBinding: "Firebrick.getById('" + me.getId() + "')._thRenderer($data, $context, $parent, $root)"
			};
		},
		/**
		 * used by theadTRTDBindings
		 * @method _thRenderer
		 * @private
		 * @return {Any}
		 */
		_thRenderer: function($data, $context, $parent, $root){
			var me = this,
				type = $data.type,
				html = $data.text ? $data.text : $data;
			
			if(type === "checkbox"){
				html = '<input type="checkbox" data-bind="' + me.dataBind("thCheckboxBindings") + '" /> ' + html;
			}
			
			return html;
		},
		/**
		 * @method tbodyBindings
		 * @return {Object}
		 */
		tbodyBindings:function(){
			return {};
		},
		/**
		 * @method tbodyTRTemplateBindings
		 * @return {Object}
		 */
		tbodyTRTemplateBindings: function(){
			var me = this;
			return {
				template: {
					name:  me.parseBind( me._getTplId() ),
					"foreach": "$data"
				}
			};
		},
		/**
		 * @method tbodyTRBindings
		 * @return {Object}
		 */
		tbodyTRBindings:function(){
			var me = this;
			return {
				foreach: "Firebrick.getById('" + me.getId() + "').columns",
				"attr":{
					"'data-tt-id'": "Firebrick.getById('" + me.getId() + "')._getItemId( $data )",
					"'data-tt-parent-id'": "$parent.id"
				},
				css: {
					"group": "$data.children ? true : false"
				},
				trRenderer: "Firebrick.getById('" + me.getId() + "')"
			};
		},
		/**
		 * @method _getItemId
		 * @param $data {ko data object}
		 * @return {ko.observable || Integer}
		 */
		_getItemId: function($data){
			var me = this;
			
			if( $.isPlainObject($data) ){
				if( !$data.hasOwnProperty( "id" ) ){
					$data.id = me._itemId++;
				}
				return $data.id;
			}
			
			return;
		},
		/**
		 * @method tbodyTRTDBindings
		 * @return {Object}
		 */
		tbodyTRTDBindings:function(){
			return {
				attr: {
					"'data-tt-id'": "$index",
					"'fb-ui-row-id'": "$parentContext.$parent.id"
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
					allowBindings: true,
					htmlWithBinding: "Firebrick.getById('" + me.getId() + "')._tdRenderer($data, $context, $parentContext, $root, $element)"
				};
			
			obj.css[me.parseBind( me.tdSpanClass )] = true;
			
			return obj;
		},
		/**
		 * @method _tdRenderer
		 * @private
		 * @return {Any}
		 */
		_tdRenderer: function($data, $context, $parentContext, $root, $element){
			var me = this,
				data = Firebrick.utils.getDeepProperty( $data.mapping,  $parentContext.$data ),	//get the value of mapping property in the parent data object
				value = me.b( data ),	//get the primitive value - so if an observable (function) simply call it, else return primitive
				type = $data.type, //check the column for the type specified
				cssClazz = "fb-ui-col-" + $context.$index();		
			
			if(!$data._colId){
				$data._colId = cssClazz;
			}
			
			$($element).addClass( cssClazz );
			
			if(type){
				if(type === "number"){
					value = parseInt( value );
				}else if(type === "float"){
					value = parseFloat( value );
				}else if (type === "checkbox"){
					if(data !== null){
						if(typeof value === "string"){
							value = value === "true" ? true : false;
						}
						value = me.checkboxRenderer( $data, data, value, $context, $parentContext, $root, $element );
					}
				}
			}
			
			if($data.renderer){
				value = $data.renderer( $data, data, value, $context, $parentContext, $root, $element );
			}
			
			return value;
		},
		/**
		 * @method thCheckboxBindings
		 * @return {Object}
		 */
		thCheckboxBindings: function(){
			var me = this,
				obj = {};
			
			obj.checked = "Firebrick.getById('" + me.getId() + "')._allCheckedObservable($context)";
			
			return obj;
		},
		/**
		 * adapted from: http://stackoverflow.com/a/31520911/425226
		 * @method _allCheckedObservable
		 * @private
		 * @param $context {ko Object}
		 * @return ko.computed
		 */
		_allCheckedObservable: function($context){
			var me = this,
				$col = $context.$data,
				$el = me.getElement();
			//store in prop and return that prop to stop memory leak from occurring
			me._allCheckedObservableProp = me._allCheckedObservableProp || ko.computed({
				read: function () {
				    var mapping = $col.mapping,
			    		data = me.getData(),
				    	func = function(_data){				//recursive function
				    		var it,
				    			children;
				    		it = Firebrick.utils.getDeepProperty( mapping, _data );	//returns property or null
							if( $.isFunction(it) && !it() ){
								return false;
							}else if( _data.children ){
								children = _data.children();
								for(var i = 0, l = children.length; i<l; i++){
									return func( children[i] );
								}
							}
					    	return true;
				    	};
				    
				    if(data && $.isFunction(data)){
				    	data = data();
				    	for(var i = 0, l = data.length; i<l; i++){
				    		return func( data[i] );	//iterate over all properties and children to determine whether the checkbox should be checked initially
				    	}
				    }
				    
				    return false;
				},
				write: function (newValue) {
					var $selector = $("tbody tr", $el),
						data,
						mapping = $col.mapping;
				    for(var i = 0, l = $selector.length; i<l; i++){
						data = Firebrick.utils.getDeepProperty(mapping, $( $selector[i] ).prop( me.propDataName ) );	//returns property or null
						if( $.isFunction( data ) ){
							data( newValue );	
						}
					}
				}
			});
			return me._allCheckedObservableProp;
		},
		/**
		 * @method checkboxRenderer
		 * @param $data
		 * @param data
		 * @param value
		 * @return {String} HTML
		 */
		checkboxRenderer: function($data, data, value){
			var me = this;
			return doT.template(checkboxTpl)({
				scope: me,
				value: value
			});
		},
		/**
		 * used by checkbox tpl
		 * @method checkboxBindings
		 * @return 
		 */
		checkboxBindings: function( value ){
			return {
				checked: "Firebrick.utils.getDeepProperty( $data.mapping, $parent )"
			};
		},
		/**
		 * @private
		 * @method _getTplId
		 * @return {String}
		 */
		_getTplId: function(){
			return "fb-ui-tpl-" + this.getId(); 
		},
		/**
		 * @method tbodyTRChildrenTemplateBindings
		 * @return {Object}
		 */
		tbodyTRChildrenTemplateBindings: function(){
			var me = this;
			return {
				template: {
					name:  me.parseBind( me._getTplId() ),
					"foreach": "$data.children"
				}
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