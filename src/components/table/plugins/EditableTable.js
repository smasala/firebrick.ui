/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * properties: {
 * 		parentsEditable: {Boolean} [default=true]
 * 		field: {
 * 			sName: "fields.email"
 * 			// all other class config properties
 * 		}
 * }
 *
 *
 * @module plugins
 * @namespace plugins
 * @class EditableTable
 */
define( [ "jquery" ], function( $ ) {
	"use strict";
	
	var clazz = Firebrick.define( "Firebrick.ui.table.plugins.EditableTable", {
		indexAttr: "data-tt-id",	//when TR - row number, when TD column number
		rowAttr: "fb-ui-row-id",	//for TD to determine which row number
		editMarker: "fb-ui-cell-editing",	//added to the TD when it cell edit is active
		currentEdit: null,	//holder for which item is current being edited - cell editting only
		hideCellClass: "fb-ui-hide-me",
		rowLoadClass: "fb-ui-edit-loading",
		/**
		 * Returns map with the fields (components) needed to edit the selection and their dependencies
		 * @method editFields
		 * @param editElement {jQuery Object} TR or TD which is being edited
		 * @param clazz {Object} table component class
		 * @param columns {Array of Objects} which columns are being edited
		 * @return {Object} {deps:[], fields:[]}
		 */
		editFields: function( editElement, clazz, columns ) {
			var me = this,
				//holder to populate with all the edit fields needed
				editFields = [],
				//dependencies that need loading for each edit field
				deps = [],
				//map of all the already added dependencies - stop duplicates
				addedPaths = {},
				//boolean
				isRow = editElement.is( "tr" ),
				//find correct parent el where the data values are stored
				parentEl = isRow ? editElement : editElement.closest( "tr" ),
				//holder for iteration
				colNumber,
				field,
				col;
			
			if ( columns ) {
				
				//iterate over column passed to this function
				for ( var i = 0, l = columns.length; i < l; i++ ) {
					colNumber = isRow ? i : editElement.attr( me.indexAttr );
					col = columns[ i ];
					if ( col.editable !== false ) {
						field = me.getFieldConfiguration( clazz, parentEl, editElement, col, colNumber, deps, addedPaths );
						if ( field ) {
							editFields.push( field );
						}
					}
				}
			}
			return { deps: deps, items: editFields };
		},
		
		/**
		 * @method getFieldConfiguration
		 * @param clazz {Object} table component class
		 * @param $tr {jQuery Object TR}
		 * @param $clickedItem {jQuery Object TR | TD etc}
		 * @param col {Object} current column for field
		 * @param colNumber {Integer}
		 * @param deps {Array}	to populate with what dependencies are needed - **variable pointers**
		 * @param addedPaths {Object} to populate which which dependencies have already been added to deps - **variable pointers**
		 * @return {Object|null} field config {sName:"fields.input", value:"abc", ...}
		 */
		getFieldConfiguration: function( clazz, $tr, $clickedItem, col, colNumber, deps, addedPaths ) {
			var me = this,
				fieldConfig = col.editConf && col.editConf.field ? col.editConf.field : {},
				path,
				data = $tr.prop( clazz.propDataName ),
				value = Firebrick.utils.getDeepProperty( col.mapping, data );
			
			if ( data.children ) {
				if ( col.editConf && col.editConf.parentsEditable === false ) {
					//cancel edit field creation as this column should not be editable when a parent item
					return;
				}
			}

			if ( value === null || value === undefined ) {
				//property not found by getDeepProperty() so we assume an edit should not be possible here
				return;
			} else if ( col.renderer && !col.type ) {
				//don't support custom renderers if no type is given
				return;
			}

			if ( fieldConfig.sName ) {
				//get the correct dependency path for the field type - i.e. "fields.input" => "Firebrick.ui/fields/Input"
				path = Firebrick.classes.getSNameConfig( fieldConfig.sName ).path;
			} else {
				//default to input field if non given
				fieldConfig.sName = col.type === "checkbox" ? "fields.checkbox" : "fields.input";
				path = Firebrick.classes.getSNameConfig( fieldConfig.sName ).path;
			}
			
			if ( !addedPaths[ path ] ) {
				addedPaths[ path ] = true;
				deps.push( path );
			}
			
			fieldConfig.label = fieldConfig.label || ( col.text ? col.text : col );
			fieldConfig.init = me._initFunction( colNumber );
			fieldConfig.value = $.isFunction( value ) ? value() : value;
			
			if ( typeof fieldConfig.value === "string" ) {
				fieldConfig.value = "'" + fieldConfig.value + "'";
			}
			
			return fieldConfig;
		},
		
		/**
		 * cell editing
		 * remove the editMarker and reset any "globals"
		 * @method removeCurrent
		 * @private
		 */
		removeCurrent: function( editElement ) {
			var me = this;
			editElement.removeClass( me.editMarker );
			me.currentEdit = null;
		},
		
		/**
		 * only for inline edit
		 * cancels any changes made and replaces the HTML with the pre-edit state
		 * @method cancelChanges
		 * @param tableClass {Object} table component class
		 * @param editElement {jQuery Object} TD
		 */
		cancelChanges: function( tableClass, editElement ) {
			var me = this;
			
			//reset html
			me.resetCell( tableClass, editElement );
		},
		
		/**
		 * @method resetCell
		 * @param value {Any} optional - if set, once the cell is reset to its original state, the value will be set
		 */
		resetCell: function( tableClass, editElement, value ) {
			var me = this,
				tdSpanClass = tableClass.tdSpanClass,
				el = $( "> [fb-view-bind]", editElement );	//find the inline edit field
			
			me.removeCurrent( editElement );
			
			if ( el.length ) {
				//remove the edit field
				el.remove();
			}
			
			//reset html
			editElement.children().removeClass( me.hideCellClass );
			
			if ( value ) {
				$( "> span." + tdSpanClass, editElement ).html( value );
			}
		},
		
		/**
		 * takes a value from the edit field and parses it accordingly - for example if the value of radio options should be numbers
		 * @method parseValue
		 * @param type {String} number, float etc
		 * @param value {Any}
		 * @return value {Any} parsed
		 */
		parseValue: function( type, value ) {
			if ( type === "number" ) {
				return parseInt( value );
			} else if ( type === "float" ) {
				return parseFloat( value );
			}
			return value;
		},
		
		/**
		 * @method makeChanges
		 * @param tableClass {Object} table component class
		 * @param editElement {jQuery Object} TR | TD
		 * @event beforeChanges(tableClass, editElement)	- event fired on tableClass
		 * @event afterChanges(tableClass, editElement)	- event fired on tableClass
		 */
		makeChanges: function( tableClass, editElement ) {
				var me = this,
					columns = tableClass.columns,
					inputs = editElement.find( "input" ),
					input,
					value, //holder
					model,
					oldValue,
					editType = tableClass.editType,
					isRow = editElement.is( "tr" ),
					$tr = isRow ? editElement : editElement.closest( "tr" ),
					colNumber;

				tableClass.fireEvent( "beforeChanges", arguments );
				
				if ( inputs.length ) {
					for ( var i = 0, l = inputs.length; i < l; i++ ) {
						input = $( inputs[ i ] );
						//filter out (continue) non checked (selected) checkboxes or radio buttons
						if ( input.attr( "type" ) === "radio" || input.attr( "type" ) === "checkbox" ) {
							if ( !input.is( ":checked" ) ) {
								continue;
							} else {
								colNumber = Firebrick.getById( input.attr( "data-cmp-id" ) )._prop;
							}
						} else {
							colNumber = Firebrick.getById( input.attr( "id" ) )._prop;
						}
						
						//example tableClass.getData()() =>
						//						[{
						//							name: "John",
						//							age: 35,
						//							job: "Carpenter",
						//							children:[{
						//								name: "Susan",
						//								age: 6,
						//								job: "pre-school"
						//							},{
						//								name: "James",
						//								age: 14,
						//								job: "annoying parents"
						//							}]
						//						}]
						
						model = Firebrick.utils.getDeepProperty( columns[ colNumber ].mapping, $tr.prop( tableClass.propDataName ) );
						
						oldValue = model();	//extract observable
						
						if ( model ) {
								value = input.val();
								value = me.parseValue( columns[ colNumber ].type, value );
								if ( editType === "cell" && value === oldValue ) {
									return me.cancelChanges( tableClass, editElement );
								} else {
									if ( model.value ) {
										model.value( value );
										//cell edit
										if ( !isRow ) {
											me.resetCell( tableClass, editElement );
										}
									} else {
										if ( value !== oldValue ) {
											model( value );	//set new value
											if ( !isRow ) {
												me.resetCell( tableClass, editElement, value );
											}
										}
									}
								}
							
						}
						
					}
				}
				
				tableClass.fireEvent( "afterChanges", arguments );
		},
		
		/**
		 * @method buildModal
		 * @param clazz {Object} component
		 * @param editFields {Object}
		 * @param editFields.deps {Array of Strings requirejs dependencies}
		 * @param editFields.items {Array of Object} items configuration for the body of the modal
		 * @param $tr {jQuery Object} tr that is to be edited
		 */
		buildModal: function( clazz, editFields, $tr ) {
			var me = this,
				customConfig = clazz.editModalConfig || {},
				
				defaultConfig = {
					title: customConfig.modalTitle || "Edit",
					target: $tr,
					items: [{
						sName: "containers.form",
						preSubmit: function() {
							var me2 = this;
							
							//make changes to table
							me.makeChanges( clazz, $tr );
							//hide the modal
							$( me2._parent.getElement() ).modal( "hide" );
							
							//prevent default form submission
							return false;
						},
						items: editFields.items
					}]
				};
				
			if ( customConfig._showEditButtons !== false ) {
				defaultConfig.footerItems = [{
					sName: "button.button",
					closeModal: true,	//hide modal
					text: customConfig.buttonUpdateText || "Update",
					handler: function() {
						me.makeChanges( clazz, $tr );
					}
				}];
			}
				
			customConfig = Firebrick.utils.overwrite( defaultConfig, customConfig );
			
			//add standard dependencies
			editFields.deps.push( Firebrick.classes.getSNameConfig( "containers.modal" ).path );
			editFields.deps.push( Firebrick.classes.getSNameConfig( "containers.form" ).path );
			editFields.deps.push( Firebrick.classes.getSNameConfig( "button.button" ).path );
			
			me.tableLoadMask( clazz.getElement() );
			require( editFields.deps, function() {
				Firebrick.create( "Firebrick.ui.containers.Modal", customConfig );
				me.removeTableLoadMask( clazz.getElement() );
			});
		},
		
		/**
		 * @method tableLoadMask
		 * @param $table {jquery Object} table
		 */
		tableLoadMask: function( $table ) {
			var me = this,
				tbody = $( "tbody", $table ),
				div = $( "<div class='fb-ui-load-mask'></div>" );
			tbody.addClass( me.rowLoadClass );
			me.appendLoadIcon( div );
			tbody.append( div );
			
		},
		
		/**
		 * @method removeTableLoadMask
		 * @param $table {jquery Object} table
		 */
		removeTableLoadMask: function( $table ) {
			var me = this,
				tbody = $( "tbody", $table );
			tbody.removeClass( me.rowLoadClass );
			$( "> div.fb-ui-load-mask", tbody ).remove();
		},
		
		/**
		 * @method appendLoadIcon
		 * @param $context {jquery Object} to append icon too
		 */
		appendLoadIcon: function( $context ) {
			$context.append( "<span class='fb-ui-load-block glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>" );
		},
		
		/**
		 * @method appendLoadIcon
		 * @param $context {jquery Object} to remove icon from
		 */
		removeLoadIcon: function( $context ) {
			$( "> .fb-ui-load-block", $context ).remove();
		},
		
		/**
		 * @method buildCellEditor
		 * @param clazz {Object} component
		 * @param editFields {Object}
		 * @param editFields.deps {Array of Strings requirejs dependencies}
		 * @param editFields.items {Array of Object} items configuration for the body of the modal
		 * @param $td {jQuery Object} td that is to be edited
		 */
		buildCellEditor: function( clazz, editFields, $td ) {
			var me = this;
			editFields.deps.push( Firebrick.classes.getSNameConfig( "containers.box" ).path );
			
			me.appendLoadIcon( $td );
			require( editFields.deps, function() {
				var field = editFields.items[ 0 ];
				
				$td.children().addClass( me.hideCellClass );
				
				field.label = false;
				field.inputWidth = 12;
				field.inputContainerBindings = me.cellEditInputContainerBindings();

				field.init = me._cellEditInit( clazz, $td );
				//build edit field
				Firebrick.create( "containers.box", {
					target: $td,
					appendTarget: true,
					enclosedBind: true,
					items: [ field ]
				});

				me.removeLoadIcon( $td );
			});
		},
		
		/**
		 * @method initEditingTR
		 * @param clazz {Object} component class Firebrick.getById($table.attr("id"))
		 * @param $table {jQuery Object} table element
		 * @param $tr {jQuery Object} tr that was double clicked
		 */
		initEditingTR: function( clazz, $table, $tr ) {
			var me = this,
				//holder - this populates the fields that are shown in the edit mask ".items"
				editFields = me.editFields( $tr, clazz, clazz.columns );
			if ( editFields.items.length ) {
				me.buildModal( clazz, editFields, $tr );
			}
		},
		
		/**
		 * @method initEditingTD
		 * @param clazz {Object} component class Firebrick.getById($table.attr("id"))
		 * @param $table {jQuery Object} table element
		 * @param $tr {jQuery Object} td that was double clicked
		 */
		initEditingTD: function( clazz, $table, $td ) {
			var me = this,
				currentEdit = me.currentEdit,
				index = $td.attr( me.indexAttr ),
				//holder - this populates the fields that are shown in the edit mask ".items"
				editFields,
				globalClick;
			
			if ( me.currentEdit ) {
				if ( me.currentEdit.is( $td ) ) {
					//same cell that is already open
					return;
				} else {
					//different cell, close the open one
					me.makeChanges( clazz, currentEdit );
				}
			}
			
			//register current edit
			me.currentEdit = $td;
			
			/*
			 * listener for clicking outside the edit cell
			 */
			globalClick = function( event ) {
				var $target = $( event.target ),
					current = me.currentEdit;
				//different cell, close the open one
				if ( current ) {
					//is the clicked target the edit element and not anything inside it
					if ( !current.is( $target ) && !current.has( $target ).length ) {
						//make changes (i.e. act like a "blur" event) and remove this click listener
						me.makeChanges( clazz, current );
						$( document ).off( "click", globalClick );
					}
				} else {
					//makeChanges has been called before this already
					//ie. the currentEdit item has been closed elsewhere, so just delete the click event
					$( document ).off( "click", globalClick );
				}
				
			};
			$( document ).on( "click", globalClick );
			/* --- **/
			
			//check if this cell isn't open for editing already
			if ( !$td.hasClass( me.editMarker ) ) {
				
				//get the field to display for editing
				editFields = me.editFields( $td, clazz, [ clazz.columns[ index ] ] );
				
				if ( editFields.items.length ) {
					//add the css to mark as open for editing and show the field
					$td.addClass( me.editMarker );
					me.buildCellEditor( clazz, editFields, $td );
				}
			}
		},
		
		/*
		 *
		 *
		 *
		 *
		 * Component method overrides
		 *
		 *
		 *
		 *
		 *
		 */
		/**
		 * override InputContainerBindings function to add more properties
		 * @method cellEditInputContainerBindings
		 * @return {Function}
		 */
		cellEditInputContainerBindings: function() {
			return function() {
				var me2 = this,
					obj = me2.callParent( arguments );
				
				obj.css[ "'col-md-10'" ] = true;
				obj.css[ "'col-lg-8'" ] = true;
				
				return obj;
			};
		},
		
		/**
		 * @method _defaultRenderAction
		 * @private
		 * @param clazz {Object} component class
		 * @param colNum {Integer}
		 */
		_defaultRenderAction: function( clazz, colNum ) {
			clazz._prop = colNum;
		},
		
		/**
		 * create a new init function with a rendered listener for the edit field
		 * when an edit field is rendered, add the column number as a property (_prop) to the class
		 * @method _initFunction
		 * @param colNum {Integer}
		 * @return {Function}
		 */
		_initFunction: function( colNum ) {
			var me = this;
			return function() {
				var me2 = this;
				
				me2.on( "rendered", function() {
					me._defaultRenderAction( me2, colNum );
				});
				
				return me2.callParent( arguments );
			};
		},
		
		/**
		 * override edit field init - cell edit only
		 * @method _cellEditInit
		 * @param clazz {Object} component clazz - edit field
		 * @param $td {jQuery Object}
		 */
		_cellEditInit: function( clazz, $td ) {
			var me = this;
			return function() {
				var me2 = this,
					sName = me2.sName;
				
				me2.on( "rendered", function() {
					var el = me2.getElement(),
						children,
						f;
					
					me._defaultRenderAction( me2, $td.attr( me.indexAttr ) );
					
					el.on( "keydown", function( event ) {
						var k = event.which;
						if ( k === 13 ) {
							me.makeChanges( clazz, $td );
						} else if ( k === 27 ) {
							me.cancelChanges( clazz, $td );
						}
					});
					
					if ( sName !== "fields.input" ) {
						children = el.is( "input" ) ? el : el.find( "input" );
						f = function() {
							me.makeChanges( clazz, $td );
							children.off( "change", f );
						};
						children.on( "change", f );
					} else {
						el.focus();
					}
					
				});
				
				return me2.callParent( arguments );
			};
		}
		
	});
	
	//jquery plugin to init editable table
	$.fn.EditableTable = $.fn.EditableTable || function() {
		var $table = $( this ),
			elements,
			plugin = Firebrick.create( "Firebrick.ui.table.plugins.EditableTable" ),	//create Plugin Class instance
			clazz = Firebrick.getById( $table.attr( "id" ) ),
			editType = clazz.editType,
			eventCallback,
			ths, $th;
		
		$table.addClass( "fb-ui-editabletable" );

		if ( editType === "row" ) {
			$table.addClass( "fb-ui-row-editing" );
			//for OPERA - http://stackoverflow.com/questions/7018324/how-do-i-stop-highlighting-of-a-div-element-when-double-clicking-on
			$table.attr( "unselectable", "on" );
			elements = $( "tbody tr", $table );
			eventCallback = function() {
				var $this = $( this );
				//stop the double click of taking event when a child element of TR is dblclicked
				if ( $this.is( "tr" ) ) {
					plugin.initEditingTR( clazz, $table, $this );
				}
			};
			
		} else if ( editType === "cell" ) {
			/*
			 * workaround to stop col width shifting from inline edit
			 * datatable plugin stops this from happening
			 */
			if ( !clazz.datatable ) { //if not active
				ths = $( "> thead th", $table );
				for ( var i = 0, l = ths.length; i < l; i++ ) {
					$th = $( ths[ i ] );
					$th.css( "width", $th.width() );
				}
			}
			
			//get the cells for the table
			elements = $( "tbody td", $table );
			//create the correct event function
			eventCallback = function() {
				var $this = $( this );
				if ( $this.is( "td" ) ) {
					plugin.initEditingTD( clazz, $table, $this );
				}
			};
		}
		
		//register event with callback
		elements.on( "dblclick", eventCallback );
	};
	
	return clazz;
	
});
