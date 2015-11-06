/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class ComboBox
 */
define( [ "text!./ComboBox.html",
        "jquery",
        "text!./combo/Item.html",
        "text!./combo/Group.html",
        "text!./combo/Value.html",
        "doT",
        "./Input",
        "Firebrick.ui.engines/Suggest",
        "../display/Loader" ], function( subTpl, $, comboItemTpl, comboGroupTpl, valueItemTpl, tplEngine ) {
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.fields.ComboBox", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.combobox",
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl: subTpl,
		/**
		 * @property multiSelect
		 * @type {Boolean}
		 * @default false
		 */
		multiSelect: false,
		/**
		 * @property maxItems
		 * @type {Integer|false}
		 * @default false
		 */
		maxItems: false,
		/**
		 * forces the select of an item
		 * @property forceSelect
		 * @type {Boolean}
		 * @default false
		 */
		forceSelect: false,
		/**
		 * set typeahead to 0 to show result to on focus
		 * @property typeahead
		 * @type {Integer}
		 * @default 1
		 */
		typeahead: 1,
		/**
		 * @property store
		 * @default null
		 */
		store: null,
		/**
		 * @property itemTpl
		 * @type {String|Function}
		 */
		itemTpl: comboItemTpl,
		/**
		 * @property groupTpl
		 * @type {String|Function}
		 */
		groupTpl: comboGroupTpl,
		/**
		 * @property valueTpl
		 * @type {String|Function}
		 */
		valueTpl: valueItemTpl,
		/**
		 * used to store generated templates - performance - initialised by precompile()
		 * @property _itemTemplate
		 * @private
		 * @type {Object}
		 * @default null
		 */
		_itemTemplate: null,
		/**
		 * @property _resultsVisible
		 * @private
		 * @type {Boolean}
		 * @default false
		 */
		_resultsVisible: false,
		/**
		 * @property labelKey
		 * @type {String}
		 * @default "text"
		 */
		labelKey: "text",
		/**
		 * @property valueKey
		 * @type {String}
		 * @default "value"
		 */
		valueKey: "value",
		/**
		 * only set if needed different to labelKey
		 * @property groupLabelKey
		 * @type {String}
		 * @default null
		 */
		groupLabelKey: null,
		/**
		 * @property _valueEl
		 * @private
		 * @type {jQuery Object}
		 * @default null
		 */
		_valueEl: null,
		/**
		 * used to configure suggestion engine object hash
		 * @property suggest
		 * @type {Object}
		 * @default null
		 */
		suggest: null,
		/**
		 * property holder for suggestion engine after construction
		 * @property _engine
		 * @private
		 * @type {Object}
		 * @default null
		 */
		_engine: null,
		/**
		 * used on keydown and when search is performed to minimise searches to when the user has stopped typing
		 * @property _timestamp
		 * @private
		 * @type {Integer} timestamp
		 * @default null
		 */
		_timestamp: null,
		/**
		 * @method getValueEl
		 * @return {jQuery Object}
		 */
		getValueEl: function() {
			var me = this;
			if ( !me._valueEl ) {
				me._valueEl = $( "> .fb-ui-combo-values", me.getElement() );
			}
			return me._valueEl;
		},
		/**
		 * @property _inputEl
		 * @private
		 * @type {jQuery Object}
		 * @default null
		 */
		_inputEl: null,
		/**
		 * @method getInputEl
		 * @return {jQuery Object}
		 */
		getInputEl: function() {
			var me = this;
			if ( !me._inputEl ) {
				me._inputEl = $( "> input.fb-ui-combo-input", me.getElement() );
			}
			return me._inputEl;
		},
		/**
		 * @property showCaret
		 * @type {Boolean}
		 * @default true
		 */
		showCaret: true,
		/**
		 * @property _caretEl
		 * @private
		 * @type {jQuery Object}
		 * @default null
		 */
		_caretEl: null,
		/**
		 * @method getCaretEl
		 * @return {jQuery Object}
		 */
		getCaretEl: function() {
			var me = this;
			if ( !me._caretEl ) {
				me._caretEl = $( "> .fb-ui-combo-select", me.getElement() );
			}
			return me._caretEl;
		},
		/**
		 * @property _resultEl
		 * @private
		 * @type {jQuery Object}
		 * @default null
		 */
		_resultEl: null,
		/**
		 * @method getResultEl
		 * @return {jQuery Object}
		 */
		getResultEl: function() {
			var me = this;
			if ( !me._resultEl ) {
				me._resultEl = me.getElement().next( ".fb-ui-combo-result[data-for='" + me.getId() + "']" );
			}
			return me._resultEl;
		},
		/**
		 * @property _clearIcon
		 * @private
		 * @type {jQuery Object}
		 * @default null
		 */
		_clearIconEl: null,
		/**
		 * @method getClearIconEl
		 * @return {jQuery Object}
		 */
		getClearIconEl: function() {
			var me = this;
			if ( !me._clearIconEl ) {
				me._cleanIconEl = $( ".fb-ui-combo-clear-icon", me.getElement() );
			}
			return me._cleanIconEl;
		},
		/**
		 * override base function
		 * @method focus
		 */
		focus: function() {
			this.getInputEl().focus();
		},
		/**
		 * @method init
		 */
		init: function() {
			var me = this;
			
			me._itemTemplate = {};
			
			me.on( "rendered", function() {
				me._initSuggestionEngine();
				me._initRendered();
			});
			
			me.on( "removeAll", function() {
				me.getClearIconEl().hide();
			});
			
			return me.callParent( arguments );
		},
		/**
		 * @method _initSuggestionEngine
		 */
		_initSuggestionEngine: function() {
			var me = this,
				conf = {
					store: me.store,
					filter: function( val ) {
						//used to exclude results from future selections - local mode
						return !val._exclude;
					}
				};
			
			conf = Firebrick.utils.overwrite( conf, ( me.suggest || {}) );
			
			me._engine = Firebrick.create( "Firebrick.ui.engines.Suggest", conf );
		},
		/**
		 * @method _initRendered
		 * @private
		 */
		_initRendered: function() {
			var me = this,
				$el = me.getElement(),
				$input = me.getInputEl(),
				$result = me.getResultEl(),
				$clearIcon = me.getClearIconEl();
			
			$el.on({
				click: function() {
					return me._onClick.apply( me, arguments );
				}
			});
			
			$clearIcon.on({
				click: function() {
					return me._onClearIconClick.apply( me, arguments );
				}
			});

			$input.on( "keydown keyup fb.update blur", function() {
				return me.resizeInput.apply( me, arguments );
			});
			
			$input.on({
				focus: function() {
					return me._onFocus.apply( me, arguments );
				},
				keydown: function() {
					return me._onKeyDown.apply( me, arguments );
				},
				keyup: function() {
					return me._onKeyUp.apply( me, arguments );
				},
				blur: function() {
					return me._onBlur.apply( me, arguments );
				}
			});
			
			$result.on( "mousedown", ".fb-ui-combo-item", function() {
				return me._onItemClick.apply( me, arguments );
			});
			
			$result.on( "mouseover", ".fb-ui-combo-item", function() {
				return me._onMouseOver.apply( me, arguments );
			});
			
			if ( me.multiSelect ) {
				$el.on( "click", ".fb-ui-combo-value-item", function() {
					return me.removeItem( $( this ) );
				});
			}
			
			me.on({
				expand: function() {
					var me = this,
						$el = me.getElement(),
						$result = me.getResultEl(),
						$active = me.getActiveItem(),
						$first;
					
					$el.addClass( "open" );
					
					if ( me.forceSelect && !$active.length ) {
						$first = $( ".fb-ui-combo-item:first-child", $result );
						if ( $first.length ) {
							me.markActive( $first );
						}
					}
					
				},
				collapse: function() {
					me.resultDefaults();
				}
			});
		},
		/**
		 * default actions on results expand/collapse
		 * @method resultsDefault
		 */
		resultDefaults: function() {
			var me = this,
				$el = me.getElement();
			
			$el.removeClass( "open" );
		},
		/**
		 * @method onFocus
		 * @private
		 */
		_onFocus: function() {
			var me = this;
			
			me.showResults();
			
			if ( me.getValue().length ) {
				me.getClearIconEl().show();
			}
			
		},
		/**
		 * @method _onClick
		 * @private
		 */
		_onClick: function() {
			var me = this,
				$input = me.getInputEl();
			$input.focus();
		},
		/**
		 * @method _onClearIconClick
		 * @private
		 */
		_onClearIconClick: function() {
			this.removeAll();
		},
		/**
		 * @method _onItemClick
		 * @private
		 */
		_onItemClick: function() {
			var me = this;
			me.selectActive();
		},
		/**
		 * @method _onMouseOver
		 * @private
		 */
		_onMouseOver: function( event ) {
			var me = this,
				clazz = "fb-ui-combo-item",
				selector = "." + clazz,
				$item = $( event.target );
			
				if ( !$item.hasClass( clazz ) ) {
					$item = $item.parent( selector );
				}
			
				me.markActive( $item );
		},
		/**
		 * @method onKeyDown
		 * @private
		 */
		_onKeyDown: function( event ) {
			var me = this,
				key = event.which,
				KeyEvent = Firebrick.ui.KeyEvents,
				$input = me.getInputEl();
			
			if ( key === KeyEvent.DOM_VK_RETURN ) {
				event.preventDefault();
			} else if ( key === KeyEvent.DOM_VK_BACK_SPACE ) {
				if ( !$input.val() ) {
					me.removeLastItem();
				}
			}
			
			me._arrowKey( key );
			
			me._timestamp = new Date().getTime();
		},
		/**
		 * @method _onKeyUp
		 * @private
		 */
		_onKeyUp: function( event ) {
			var me = this,
				key = event.which,
				KeyEvent = Firebrick.ui.KeyEvents,
				$input = me.getInputEl();
			
			if ( !me.actionKey( key ) ) {
				if ( $input.val().trim() ) {
					
					Firebrick.delay(function() {
						var t = new Date().getTime();
						if ( ( t - me._timestamp ) >= 300 ) {
							me._timestamp = t;
							me.showResults();
						}
					}, 301 );
					
				} else {
					me.hideResults();
				}
			} else {
				if ( key === KeyEvent.DOM_VK_RETURN ) {
					event.preventDefault();
					me.selectActive();
				} else if ( key === KeyEvent.DOM_VK_DOWN ) {
					if ( !$input.val() ) {
						//show all
						if ( !me._resultsVisible ) {
							me.showResults();
						}
					}
				}
			}
			
		},
		/**
		 * @method _onBlur
		 * @private
		 */
		_onBlur: function() {
			var me = this;
			if ( me.forceSelect ) {
				//TODO: only if no value already set
				if ( !me.getValue().length ) {
					me.selectActive();
				}
			}
			Firebrick.delay(function() {
				me.getClearIconEl().hide();
			}, 200 );
			me.hideResults();
		},
		/**
		 * @method reset
		 */
		reset: function() {
			var me = this;
			me.hideResults();
			me.clearInput();
		},
		/**
		 * @method resizeInput
		 */
		resizeInput: function() {
			var me = this,
				$input = me.getInputEl(),
				currentWidth = $input.width(),
				width = me._measureWidth( $input ) + 8;
			if ( width !== currentWidth ) {
				$input.width( width );
			}
		},
		/**
		 * @method _measureWidth
		 * @private
		 * @return {Integer}
		 */
		_measureWidth: function( $input ) {
			var $tmp = $( "<tmp>" ).css({
					position: "absolute",
					top: -99999,
					left: -99999,
					width: "auto",
					padding: 0,
					whiteSpace: "pre"
				}).text( $input.val() ).appendTo( "body" ),
				styles = [ "letterSpacing",
				"fontSize",
				"fontFamily",
				"fontWeight",
				"textTransform" ],
				style,
				copiedStyles = {},
				width;
			
			for ( var i = 0, l = styles.length; i < l; i++ ) {
				style = styles[ i ];
				copiedStyles[ style ] = $input.css( style );
			}
			
			$tmp.css( copiedStyles );
			width = $tmp.width();
			$tmp.remove();
			return width;
		},
		/**
		 * @method actionKey
		 * @return {Boolean}
		 */
		actionKey: function( keyCode ) {
			var KeyEvent = Firebrick.ui.KeyEvents;
			
			if (	keyCode === KeyEvent.DOM_VK_DOWN ||
				keyCode === KeyEvent.DOM_VK_UP ||
				keyCode === KeyEvent.DOM_VK_RETURN ) {
				return true;
			}
			
			return false;
		},
		/**
		 * @method getActiveItem
		 * @return {jQuery Object}
		 */
		getActiveItem: function() {
			var me = this,
				$item = $( ".fb-ui-combo-item.active", me.getResultEl() );
			return $item;
		},
		
		/**
		 * @method markActive
		 * @param $item {jQuery Object}
		 */
		markActive: function( $item ) {
			var me = this,
				$active = me.getActiveItem();
			if ( $item.length ) {
				$active.removeClass( "active" );
				$item.addClass( "active" );
				$item.focus();
			}
		},
		/**
		 * @method selectActive
		 * @param $item {jQuery Object} optional
		 */
		selectActive: function( $item ) {
			var me = this,
				$active = $item || me.getActiveItem(),
				data = {},
				values = [];
					
			if ( $active.length ) {

				data = $active.prop( "data-value" );
				
				//exclude result from future searches
				data._exclude = true;
				
				values.push( data );

				me.setValue( values );
				
				if ( values.length ) {
					me.getClearIconEl().show();
				}
			}
			
		},
		/**
		 * @event removeAll
		 * @method removeAll
		 */
		removeAll: function() {
			var me = this,
				oldValue = me.getValue(),
				$items = $( ".fb-ui-combo-value-item", me.getValueEl() );
			
			for ( var i = 0, l = $items.length; i < l; i++ ) {
				//remove exclude filter on all items
				$( $items[ 0 ] ).prop( "data-value" )._exclude = false;
			}
			
			$items.remove();
			me._checkChange( me.getValue(), oldValue );
			me.fireEvent( "removeAll" );
		},
		/**
		 * @event removeItem
		 * @method removeItem
		 * @param $item {jQuery Item}
		 */
		removeItem: function( $item ) {
			var me = this,
				oldValue = me.getValue(),
				data = $item.prop( "data-value" );
			data._exclude = false;
			$item.remove();
			me._checkChange( me.getValue(), oldValue );
			me.on( "removeItem" );
		},
		/**
		 * @method removeLastItem
		 */
		removeLastItem: function() {
			var me = this,
				$items = $( ".fb-ui-combo-value-item", me.getValueEl() ),
				$last = $items.last();
			
			if ( $items.length === 1 && me.forceSelect ) {
				return;
			}
			
			if ( $last.length ) {
				me.removeItem( $last );
			}
		},
		/**
		 * @method clearInput
		 */
		clearInput: function() {
			var me = this,
				$input = me.getInputEl();
			
			$input.val( "" );
		},
		/**
		 * @method _arrowKey
		 * @private
		 * @return boolean
		 */
		_arrowKey: function( keyCode ) {
			var me = this,
				keyboard = Firebrick.ui.KeyEvents,
				selector = ".fb-ui-combo-item",
				groupSelector = ".fb-ui-combo-group-item",
				$result = me.getResultEl(),
				$active = $( selector + ".active", $result ),
				$sibling;
			
			if ( me._resultsVisible ) {
				
				//only on up and down actions
				if ( keyCode === keyboard.DOM_VK_DOWN || keyCode === keyboard.DOM_VK_UP ) {
					
					if ( $active.length ) {
						
						if ( keyCode === keyboard.DOM_VK_DOWN ) {
							$sibling = $active.next();
							if ( !$sibling.length ) {
								$sibling = $active.closest( groupSelector ).next();
							}
						} else {
							$sibling = $active.prev();
							if ( !$sibling.length ) {
								$sibling = $active.closest( groupSelector ).prev();
							}
						}
						
						//check if sibling is another group
						if ( $sibling.is( groupSelector ) ) {
							//find appropriate sibling in group
							if ( keyCode === keyboard.DOM_VK_DOWN ) {
								$sibling = $sibling.find( selector ).first();
							} else {
								$sibling = $sibling.find( selector ).last();
							}
						}
						
						me.markActive( $sibling );
						me._scrollOnKey( keyCode, $sibling, $result );
						
					} else {
						me.markActive( $result.find( ".fb-ui-combo-item" ).first() );
					}
					
					return true;
				}
				
			}
			
			return false;
		},
		/**
		 * return items which is currently highlighted in the dropdown - these are not necessarily selected values, see getValue()
		 * @method getSelection
		 * @return {jQuery Object | null}
		 */
		getSelection: function() {
			var me = this,
				$result = me.getResultEl();
			if ( me._resultsVisible ) {
				return $( ".fb-ui-combo-item.active", $result );
			}
		},
		/**
		 * @method _scollOnKey
		 * @param keycode {Integer}
		 * @param $target {jQuery Object}
		 * @param $container {jQuery Object}
		 */
		_scrollOnKey: function( keycode, $target, $container ) {
			var sibTop,
				sibBottom,
				KeyEvent = Firebrick.ui.KeyEvents,
				resTop = $container.offset().top,
				resHeight = $container.height(),
				resBottom = resTop + resHeight,
				scrollTo = null;
			
			if ( $target.length ) {
				if ( keycode === KeyEvent.DOM_VK_DOWN ) {
					sibBottom = $target.offset().top + $target.outerHeight();
					if ( sibBottom > resBottom ) {
						scrollTo = ( $container.scrollTop() + sibBottom ) - resTop - resHeight;
					}
				} else {
					sibTop = $target.offset().top;
					if ( sibTop < resTop ) {
						scrollTo = sibTop - resTop + $container.scrollTop();
					}
				}
				if ( scrollTo !== null ) {
					$container.scrollTop( scrollTo );
				}
			}
		},
		/**
		 * suggestion engine search
		 * @method search
		 * @param query {String}
		 * @param callback {Function} called after search is complete - args {Array of Results}
		 * @return {self}
		 */
		search: function( query, callback ) {
			var me = this;
			
			me._engine.query( query, callback );
			
			return me;
		},
		/**
		 * @method showResults
		 */
		showResults: function() {
			var me = this,
				$el = me.getElement(),
				$input = me.getInputEl(),
				$result = me.getResultEl(),
				query = $input.val().trim(),
				loader,
				item;

			if ( query.length >= me.typeahead ) {
				$result.empty();
				
				$result.css({
					top: $el.offset().top + $el.outerHeight(),
					width: $el.outerWidth()
				});
				
				$result.show();
				
				me._resultsVisible = true;
				
				if ( me._engine.mode !== "local" ) {
					loader = Firebrick.create( "Firebrick.ui.display.Loader", {
						target: $result
					});
				}

				//delay the search to allow the loader to be displayed
				Firebrick.delay(function() {
					me.search( query, function( results ) {
						var elements = [];
						if ( loader ) {
							loader.destroy();
						}
						if ( results ) {
							for ( var i = 0, l = results.length; i < l; i++ ) {
								item = results[ i ];
								item.index = i;
								elements.push( me.renderItem( item ) );
							}

							$result.empty(); //remove loading
							$result.append( elements );
							
							//make sure scrolled at the top
							$result.scrollTop( 0 );
						
							me.fireEvent( "expand" );
						}
					});
				}, 10 );
			}
		},
		/**
		 * @method hideResults
		 */
		hideResults: function() {
			var me = this,
				$result = me.getResultEl();
			
			if ( me._resultsVisible ) {
				me._resultsVisible = false;
				$result.hide();
				me.fireEvent( "collapse" );
			}
		},
		/**
		 * @method renderChildren
		 * @param data {Object}
		 * @param scope {Object} optional
		 * @return {Array} jQuery elements
		 */
		renderChildren: function( data, scope ) {
			var me = this,
				items = [];
			if ( data.children ) {
				for ( var i = 0, l = data.children.length; i < l; i++ ) {
					items.push( me.renderItem( data.children[ i ], scope ) );
				}
			}
			return items;
		},
		/**
		 * @method renderItem
		 * @param data {Object}
		 * @param scope {Object} optional
		 * @return {jQuery Object} element
		 */
		renderItem: function( data, scope ) {
			var me = this,
				prop = data.children ? "groupTpl" : "itemTpl",
				$el;
			
			$el = me._renderItem( prop, data, scope );
			
			if ( data.children ) {
				$( ".fb-ui-combo-group-children", $el ).html( me.renderChildren( data, scope ) );
			}
			
			return $el;
		},
		/**
		 * @method renderValueItem
		 * @param data {Object}
		 * @param scope {Object} optional
		 * @return {jQuery Object} element
		 */
		renderValueItem: function( data, scope ) {
			return this._renderItem( "valueTpl", data, scope );
		},
		/**
		 * @method _renderItem
		 * @private
		 * @param tplProp {String} name of tpl property to use
		 * @param data {Object}
		 * @param scope {Object} optional
		 * @return {jQuery Object} html element
		 */
		_renderItem: function( tplProp, data, scope ) {
			var me = this,
				tpl = $.isFunction( me[ tplProp ] ) ? me[ tplProp ]() : me[ tplProp ];
			data._scope = data._scope || scope || me;
			if ( !me._itemTemplate[ tplProp ] ) {
				me._itemTemplate[ tplProp ] = tplEngine.template( tpl );
			}
			return $( me._itemTemplate[ tplProp ]( data ) ).prop( "data-value", data );
		},
		/**
		 * @method bindings
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'fb-ui-combobox'" ] = true;
			
			if ( me.multiSelect ) {
				obj.css.multiple = true;
			} else {
				obj.css.single = true;
			}
			
			return obj;
		},
		/**
		 * @method valueBindings
		 */
		valueBindings: function() {
			var obj = {
					css: {
						"'fb-ui-combo-values'": true
					}
				};
			
			return obj;
		},
		/**
		 * @method inputBindings
		 */
		inputBindings: function() {
			var obj = {
					css: {},
					attr: {
						autocomplete: true,
						tabindex: true
					}
				};
			
			obj.css[ "'fb-ui-combo-input'" ] = true;
			
			return obj;
		},
		/**
		 * @method clearIconBindings
		 */
		clearIconBindings: function() {
			var obj = {
					css: {
						glyphicon: true,
						"'glyphicon-remove-circle'": true,
						"'fb-ui-combo-clear-icon'": true
					}
				};
			
			return obj;
		},
		/**
		 * @method singleSelectBindings
		 */
		singleSelectBindings: function() {
			var me = this,
				obj = {
					css: {
						"'fb-ui-combo-select'": true,
						caret: me.typeahead === 0 ? me.showCaret : false
					}
				};
			
			return obj;
		},
		/**
		 * @method resultBindings
		 */
		resultBindings: function() {
			var obj = {
					css: {
						"'fb-ui-combo-result'": true
					}
				};
			
			return obj;
		},
		/**
		 * override
		 * @method _hasChange
		 * @param newVal {Any}
		 * @param oldVal {Any}
		 * @return {Boolean}
		 */
		_hasChange: function( newVal, oldVal ) {
			return !Firebrick.utils.compareArrays( newVal, oldVal );
		},
		/**
		 * return get all values which have been selected
		 * @method getValue
		 * @return {Array}
		 */
		getValue: function() {
			var me = this,
				$vals = $( "> .fb-ui-combo-value-item", me.getValueEl() ),
				values = [],
				valKey = me.valueKey,
				val;
			
			for ( var i = 0, l = $vals.length; i < l; i++ ) {
				val = $( $vals[ i ] ).prop( "data-value" );
				val = valKey ? val[ valKey ] : val;
				values.push( val );
			}
			
			return values;
		},
		/**
		 * @method setValues
		 * @param values {Array}
		 * @return parent
		 */
		setValue: function() {
			var me = this,
				$valueBox = me.getValueEl();
	
			if ( me.maxItems !== false ) {
				if ( $( ".fb-ui-combo-value-item", $valueBox ).length === me.maxItems ) {
					//number of max items already reached
					return;
				}
			}
			
			return me.callParent( arguments );
		},
		/**
		 * @method _setValue
		 * @param value {Array}
		 * @private
		 */
		_setValue: function( values ) {
			var me = this,
				$valueBox = me.getValueEl(),
				$vals = [];
	
			if ( values.length ) {
				
				for ( var i = 0, l = values.length; i < l; i++ ) {
					$vals.push( me.renderValueItem( values[ i ] ) );
				}
				
				if ( me.multiSelect ) {
					$valueBox.append( $vals );
				} else {
					$valueBox.html( $vals );
				}
				
				me.reset();
			}
			return me;
		}
	});
});
