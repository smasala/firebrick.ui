/*!
* Firebrick UI
* @author Steven Masala [me@smasala.com]
* @version 0.20.22
* @date
*
* FirebrickUI, component library for Firebrick JS
**/
define( 'firebrick-ui',[ "jquery", "firebrick", "knockout",  "devicejs", "knockout-mapping", "text", "bootstrap" ], function( $, fb, ko, dev, kom ) {
	"use strict";
	var Firebrick = window.Firebrick;
	
	//ko mapping
	ko.mapping = kom;
	
	if ( !Firebrick ) {
		console.error( "Firebrick has not been loaded, Firebrick-UI requires Firebrick JS to function" );
		return;
	} else if ( Firebrick.ui ) {
		console.error( "Firebrick.ui namespace has already been taken!" );
		return;
	}
	
	Firebrick._ns.push( "Firebrick.ui" );
	
	/**
	 * Firebrick component library for Firebrick JS MVC
	 * @module Firebrick.ui
	 * @class ui
	 */
	Firebrick.ui = {
			/**
			 * library version number
			 * @property version
			 * @private
			 * @type {String}
			 */
			version: "0.20.22",
			
			/**
			 * populate a target with fields and data
			 *
			 * @method build
			 * @param {Object} config
			 * @param {Object} config.target selector string, jquery object (optional) if none passed, html is returned
			 * @param {Object} config.items array of strings or objects ["fb-ui-input", {sName:"fb-ui-textarea"}]
			 * @param {Object} config.view Firebrick view class (optional), must be defined for rendered event to be fired
			 * @return {String} html
			 */
			build: function( config ) {
				var me = this,
					target = Firebrick.views.getTarget( config.target ),
					r, html;
				
				r = me._populate( config.items, config.view );
				html = r.html;
				
				if ( config.view && r.items.length ) {
					config.view.items = r.items;
				}
				
				if ( target ) {
					target.append( html );
				}
				
				return html;
			},
			
			/**
			 * recursive function
			 * create components and html from an array of items
			 * @private
			 * @method _populate
			 * @return {Object} :: {html: string, items: array of objects}
			 */
			_populate: function( items, parent ) {
				var me = this,
					_items = [],
					html = "",
					component;

				if ( $.isFunction( items ) ) {
					items = items();
				}

				if ( !$.isArray( items ) && items ) {
					items = [ items ];
				}
				
				if ( $.isArray( items ) && items.length ) {
					if ( parent.defaults ) {
						//get all defaults down the prototype tree
						Firebrick.utils.merge( "defaults", parent );
						//add the defaults to direct items
						//TODO: if items is a function?
						for ( var i = 0, l = items.length; i < l; i++ ) {
							items[ i ] = Firebrick.utils.copyover( items[ i ], parent.defaults );
						}
					}
					
					for ( var x = 0, y = items.length; x < y; x++ ) {
						component = me._buildComponent( items[ x ], parent );
						html += component._html;
						//cache component pointer so it can be found by id
						if ( !component.getId ) {
							console.error( "something went wrong", items[ x ], "is it defined correctly? Check the item name and dependency include" );
						}
						component.fireEvent( "uiBuilt" );
						_items.push( component );
					}
				}
				
				return { html: html, items: _items };
			},
			
			/**
			 * method used by _populate
			 * @private
			 * @method _buildComponent
			 * @param v {Object|String} component or name of component
			 * @param parent {Object} component parent object
			 * @return {Object} component
			 */
			_buildComponent: function( v, parent ) {
				var me = this,
					component,
					tmp;
				
				if ( v.isView ) {
					if ( v._state !== "initial" ) {
						component = v.init();
					}
					component = v;
				} else if ( v.viewName ) {
					//Creates a view from a JS file
					//Firebrick.create("MyApp.view.MyView", {})
					component = Firebrick.create( v.viewName, v );
				} else {
					
					v = me._componentFilter( v );
					
					if ( !v.uiComponent ) {
						if ( v.sName ) {
							v.sName = v.sName.toLowerCase();
						}
						//v can be string or object
						tmp = Firebrick.get( v.sName || v );
						if ( !tmp ) {
							console.error( "Has", ( v.sName || v ), "been added as a dependency?" );
						}
						//Object.getPrototypeOf(object.create) to make a new copy of the properties and not a pointer to v
						component = Firebrick.create( tmp._classname, ( v.sName ? Object.getPrototypeOf( Object.create( v ) ) : null ) );
					} else {
						//v is already a field class
						component = v;
					}
				}
				
				if ( !component._parent ) {
					//if not set yet
					component._parent = parent;
				}
				
				if ( component.build ) {
					component._html = component.build();
				}
				
				return component;
			},
			
			/**
			 * this method converts shorthand component definitions
			 * @example
			 * 		//component definition    "|"
			 * 		//converts to the component <hr>
			 * @method _componentFilter
			 * @private
			 * @param v {String}
			 * @return {String}
			 */
			_componentFilter: function( name ) {
				//var me = this;
				
				if ( typeof name === "string" ) {
					switch ( name ){
						case "|":
							name = "display.divider";
							break;
					}
				}
				
				return name;
			},
			
			/**
			 * @method getCmp
			 * @param id {String}
			 * @return {Object|null}
			 */
			getCmp: function( id ) {
				return Firebrick.getById( id );
			},
			
			/**
			 * alias for Firebrick.get
			 *
			 * @method get
			 * @param {String} name
			 * @return {Object}
			 */
			get: function( name ) {
				return Firebrick.get( name );
			},
			
			/**
			 * util methods
			 * @for ui
			 * @class utils
			 */
			utils: {
				
				/**
				 * @private
				 * @method _buildDotObj
				 * @example
				 * 		//example: a.b.c.d
				 *		//convert to:
				 *			a:{
				 *				b:{
				 *					c:{
				 *						d:sName
				 *					}
				 *				}
				 *			}
				 * @param arr {Array of Strings}
				 * @param sName {String} the original sName
				 * @param prev {Object} optional, used by recursion
				 * @return {Object}
				 */
				_buildDotObj: function( arr, sName, prev ) {
					var me = this,
						prop = arr.shift(); //remove the first item use it as property name
					
					//check if prev has already been initialised
					prev = prev || {};
						
					prev[ prop ] = {};
					
					//more items in arr?
					if ( arr.length ) {
						if ( arr[ 0 ] !== "" ) {
							//call self recursively
							me._buildDotObj( arr, sName, prev[ prop ] );
						} else {
							console.error( "error building sName, found empty string", arr, prop, sName );
						}
						
					} else {
						prev[ prop ] = sName;
					}
					
					return prev;
				},
				
				/**
				 * @method isVisible
				 * @param $element {jQuery Object}
				 * @param $container {jQuery Object}
				 * @return {Boolean}
				 */
				isVisible: function( $element, $container ) {
					var cont = {
							offset: $container.offset(),
							height: $container.height(),
							width: $container.width()
						},
						el = {
							offset: $element.offset(),
							height: $element.height(),
							width: $element.width()
						},
						check = function( coord ) {
							if ( coord > cont.offset.top && coord < cont.offset.left ) {
								if ( coord < cont.bottom ) {
									return true;
								}
							}
							return false;
						};
					
					cont.bottom = cont.offset.top + cont.height;
					el.bottom = el.offset.top + el.height;
					
					if ( check( el.offset.top ) ||
						check( el.offset.top + el.width ) ||
						check( el.bottom ) ||
						check( el.bottom + el.width ) ) {
						return true;
					}
					
					return false;
				},
				
				/**
				 * if you are unsure of the parameters type - use this function to get the raw value. I.e. if its a function it will be called and returned, otherwise it will just return it.
				 * useful when working with Knockout objects
				 * @method getValue
				 * @param {Function|Any} val
				 * @return {Any}
				 */
				getValue: function( val ) {
					if ( $.isFunction( val ) ) {
						return val();
					}
					return val;
				},
				
				/**
				 * convert a JS Object into a simple "json" type string, this is mainly used for the data-bind attribute in Knockout
				 *
				 * @method stringify
				 * @param {Object} objToConvert
				 * @return {String}
				 */
				stringify: function( objToConvert ) {
					if ( objToConvert ) {
						
						var loop = function( obj, f ) {
							var p = f ? "" : "{",
								k,v;
							for ( k in obj ) {
								if ( obj.hasOwnProperty( k ) ) {
									v = obj[ k ];
									if ( $.isPlainObject( v ) ) {
										p += k + ":" + loop( v );
									} else {
										p += k + ": " + v + ",";
									}
								}
							}
							//remove last ", "
							p = p.substr( -1 ) === "," ? p.substring( 0, p.length - 1 ) : p;
							p += f ? "" : "},";
							return p;
						};
						
						return loop( objToConvert, true );
					}
					return "";
				}
				
			},
			/**
			 * cross platform as chrome doesn't support them natively
			 * @for ui
			 * @class KeyEvents
			 */
			KeyEvents: {
		            DOM_VK_CANCEL: 3,
		            DOM_VK_HELP: 6,
		            DOM_VK_BACK_SPACE: 8,
		            DOM_VK_TAB: 9,
		            DOM_VK_CLEAR: 12,
		            DOM_VK_RETURN: 13,
		            DOM_VK_ENTER: 14,
		            DOM_VK_SHIFT: 16,
		            DOM_VK_CONTROL: 17,
		            DOM_VK_ALT: 18,
		            DOM_VK_PAUSE: 19,
		            DOM_VK_CAPS_LOCK: 20,
		            DOM_VK_ESCAPE: 27,
		            DOM_VK_SPACE: 32,
		            DOM_VK_PAGE_UP: 33,
		            DOM_VK_PAGE_DOWN: 34,
		            DOM_VK_END: 35,
		            DOM_VK_HOME: 36,
		            DOM_VK_LEFT: 37,
		            DOM_VK_UP: 38,
		            DOM_VK_RIGHT: 39,
		            DOM_VK_DOWN: 40,
		            DOM_VK_PRINTSCREEN: 44,
		            DOM_VK_INSERT: 45,
		            DOM_VK_DELETE: 46,
		            DOM_VK_0: 48,
		            DOM_VK_1: 49,
		            DOM_VK_2: 50,
		            DOM_VK_3: 51,
		            DOM_VK_4: 52,
		            DOM_VK_5: 53,
		            DOM_VK_6: 54,
		            DOM_VK_7: 55,
		            DOM_VK_8: 56,
		            DOM_VK_9: 57,
		            DOM_VK_SEMICOLON: 59,
		            DOM_VK_EQUALS: 61,
		            DOM_VK_A: 65,
		            DOM_VK_B: 66,
		            DOM_VK_C: 67,
		            DOM_VK_D: 68,
		            DOM_VK_E: 69,
		            DOM_VK_F: 70,
		            DOM_VK_G: 71,
		            DOM_VK_H: 72,
		            DOM_VK_I: 73,
		            DOM_VK_J: 74,
		            DOM_VK_K: 75,
		            DOM_VK_L: 76,
		            DOM_VK_M: 77,
		            DOM_VK_N: 78,
		            DOM_VK_O: 79,
		            DOM_VK_P: 80,
		            DOM_VK_Q: 81,
		            DOM_VK_R: 82,
		            DOM_VK_S: 83,
		            DOM_VK_T: 84,
		            DOM_VK_U: 85,
		            DOM_VK_V: 86,
		            DOM_VK_W: 87,
		            DOM_VK_X: 88,
		            DOM_VK_Y: 89,
		            DOM_VK_Z: 90,
		            DOM_VK_CONTEXT_MENU: 93,
		            DOM_VK_NUMPAD0: 96,
		            DOM_VK_NUMPAD1: 97,
		            DOM_VK_NUMPAD2: 98,
		            DOM_VK_NUMPAD3: 99,
		            DOM_VK_NUMPAD4: 100,
		            DOM_VK_NUMPAD5: 101,
		            DOM_VK_NUMPAD6: 102,
		            DOM_VK_NUMPAD7: 103,
		            DOM_VK_NUMPAD8: 104,
		            DOM_VK_NUMPAD9: 105,
		            DOM_VK_MULTIPLY: 106,
		            DOM_VK_ADD: 107,
		            DOM_VK_SEPARATOR: 108,
		            DOM_VK_SUBTRACT: 109,
		            DOM_VK_DECIMAL: 110,
		            DOM_VK_DIVIDE: 111,
		            DOM_VK_F1: 112,
		            DOM_VK_F2: 113,
		            DOM_VK_F3: 114,
		            DOM_VK_F4: 115,
		            DOM_VK_F5: 116,
		            DOM_VK_F6: 117,
		            DOM_VK_F7: 118,
		            DOM_VK_F8: 119,
		            DOM_VK_F9: 120,
		            DOM_VK_F10: 121,
		            DOM_VK_F11: 122,
		            DOM_VK_F12: 123,
		            DOM_VK_F13: 124,
		            DOM_VK_F14: 125,
		            DOM_VK_F15: 126,
		            DOM_VK_F16: 127,
		            DOM_VK_F17: 128,
		            DOM_VK_F18: 129,
		            DOM_VK_F19: 130,
		            DOM_VK_F20: 131,
		            DOM_VK_F21: 132,
		            DOM_VK_F22: 133,
		            DOM_VK_F23: 134,
		            DOM_VK_F24: 135,
		            DOM_VK_NUM_LOCK: 144,
		            DOM_VK_SCROLL_LOCK: 145,
		            DOM_VK_COMMA: 188,
		            DOM_VK_PERIOD: 190,
		            DOM_VK_SLASH: 191,
		            DOM_VK_BACK_QUOTE: 192,
		            DOM_VK_OPEN_BRACKET: 219,
		            DOM_VK_BACK_SLASH: 220,
		            DOM_VK_CLOSE_BRACKET: 221,
		            DOM_VK_QUOTE: 222,
		            DOM_VK_META: 224
			},
			/**
			 * similar to utils, but are component related
			 * @for ui
			 * @class helper
			 */
			helper: {
				
				/**
				 * @method getHTML
				 * @param componentId {String}
				 * @param $data {KO Object}
				 * @param $$context {KO Object}
				 * @return {String} html
				 */
				getHtml: function( componentId, $data, $context ) {
					var component = Firebrick.getById( componentId ),
						html = component.html;
					
					if ( $.isFunction( html ) ) {
						html = html( $data, $context );
					}
					
					if ( typeof html === "string" ) {
						if ( $data.hasOwnProperty( html ) ) {
							return $data[ html ];
						}
					}
					return html;
				},
				
				/**
				 * builds the items string used for functions such as "foreach"
				 * @method tabBuilder
				 * @param componentId {Objects}
				 * @return {String}
				 */
				tabBuilder: function( componentId ) {
					var component = Firebrick.getById( componentId ),
						data = component.items;
					
					if ( $.isFunction( data ) ) {
						return "Firebrick.getById('" + componentId + "').items()";
					} else if ( $.isArray( data ) ) {
						return "Firebrick.getById('" + componentId + "').items";
					}
					
					return data;
				},
				
				/**
				 * builds the options string used for functions such as "foreach"
				 * @method optionString
				 * @param component {Objects}
				 * @return {String}
				 */
				optionString: function( component ) {
					var data = component.options;
					
					if ( $.isFunction( data ) ) {
						return "Firebrick.ui.getCmp('" + component.getId() + "').options()";
					} else if ( $.isArray( data ) ) {
						return "Firebrick.ui.getCmp('" + component.getId() + "').options";
					}
					
					return data;
				},
				
				/**
				 * builds links, if value then return the value overwise return false and remove the href attribute
				 * @method linkBuilder
				 * @param {Object} value - optional
				 * @param {Object} value.link
				 * @return {String | false}
				 */
				linkBuilder: function( value ) {

					if ( value ) {
						if ( typeof value.link === "string" ) {
							return value.link;
						} else if ( typeof value.href === "string" ) {
							return value.href;
						}
					}
					
					return false;
				},
				
				callFunction: function( classId, functionName, args ) {
					var clazz = Firebrick.getById( classId );
					if ( clazz && functionName ) {
						clazz[ functionName ].apply( clazz, args );
					}
				}
				
			},

			/**
			 * renderer methods
			 * @for ui
			 * @class renderer
			 */
			renderer: {
				/**
				 * @property _registry
				 * @type {Object}
				 * @private
				 */
				_registry: {},
				
				/**
				 * @method add
				 * @param name {String} name of the renderer
				 * @param func {Function} function to call when the renderer is used - parameters given to the function when called: $data, $context, $parent, $root
				 * @return self
				 */
				add: function( name, func ) {
					var me = this;
					
					me._registry[ name ] = func;
					
					return me;
				},
				
				/**
				 * @method get
				 * @param name {String} name of the renderer
				 * @return {Function || null}
				 */
				get: function( name ) {
					var me = this;
					if ( $.isFunction( name ) ) {
						//catch KO function variation
						name = name();
					}
					return me._registry[ name ];
				}
			}
			
	};
	
	/**
	 * Overwrites "Firebrick.view.Base"
	 * @extends class.Base
	 * @class view.Base
	 */
	Firebrick.classes.overwrite( "Firebrick.view.Base", {
		_ko: null,
		/**
		 * @property passDownEvents
		 * @type {Object}
		 * @default {
				rendered: 1,
				htmlRendered: 1,
				unbound: 1
			}
		 */
		passDownEvents: {
			rendered: 1,
			htmlRendered: 1,
			unbound: 1,
			destroy: 1
		},
		
		listeners: {
			uiBuilt: function() {
				var me = this,
					k;
				if ( me.passDownEvents ) {
					
					Firebrick.utils.merge( "passDownEvents", me );
					
					for ( k in me.passDownEvents ) {
						if ( me.passDownEvents.hasOwnProperty( k ) ) {
							if ( me._parent ) {
								me._initPassDownEvent( k );
							}
						}
					}
					
				}
			}
		},
		/**
		 * @method _initPassDownEvent
		 */
		_initPassDownEvent: function( eventName ) {
			var me = this,
				f = me._createPassEvent( me );
			
			me._parent.on( eventName, f );
			me.on( "destroy", function() {
				f.__isDestroyed = true;
				//TODO: fixed this
				//me._parent.off(eventName, f);
			});
		},
		/**
		 * @method _createPassEvent
		 * @private
		 * @return {Function}
		 */
		_createPassEvent: function( scope ) {
			return function() {
				var me = this,
					args = Array.prototype.slice.call( arguments );
				args = [ me.event.eventName ].concat( args );
				scope.fireEvent.apply( scope, args );
			};
		},
		
		/**
	 	 * @property items
		 * @type {Array|Function}
		 * @default null
		 */
		items: null,
		/**
		 * @property tpl
		 * @type {Function}
		 * @return {String}
		 */
		tpl: function() {
			var me = this;
			if ( me.items ) {
				return Firebrick.ui.build({
					items: me.items,
					view: me
				});
			}
		}
	});
	
	/*
	 * Knockout bindingHandler extensions
	 */
	(function( ko ) {
		/*
		 * use withProperties to pass extra properties down to the descendants
		 * http://knockoutjs.com/documentation/custom-bindings-controlling-descendant-bindings.html
		 */
		ko.bindingHandlers.withProperties = {
		    init: function( element, valueAccessor, allBindings, viewModel, bindingContext ) {
		        // Make a modified binding context, with a extra properties, and apply it to descendant elements
		        var childBindingContext = bindingContext.createChildContext(
		            bindingContext.$rawData,
		            null, // Optionally, pass a string here as an alias for the data item in descendant contexts
		            function( context ) {
		                ko.utils.extend( context, valueAccessor() );
		            });
		        ko.applyBindingsToDescendants( childBindingContext, element );
		 
		        // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
		        return { controlsDescendantBindings: true };
		    }
		};
		
		//activate binding on any element injected with "html" property
		//modified from http://stackoverflow.com/a/29605553/425226
		ko.bindingHandlers.htmlWithBinding = {
			  "init": function() {
				  return { "controlsDescendantBindings": true };
			  },
			  "update": function( element, valueAccessor, allBindings, viewModel, bindingContext ) {
				  var val = valueAccessor();
				  if ( val === null ) {
					  val = ""; //IE fix
				  }
				  element.innerHTML = val;
				  ko.applyBindingsToDescendants( bindingContext, element );
			  }
		};
		
		/*
		 * use debug to simply console out any given arguments
		 * http://www.knockmeout.net/2013/06/knockout-debugging-strategies-plugin.html
		 */
		ko.virtualElements.allowedBindings.debug = true;
		ko.bindingHandlers.debug = {
		    init: function( element, valueAccessor, allBindings, viewModel, bindingContext ) {
		       console.warn( "Debug:", element, valueAccessor(), allBindings(), viewModel, bindingContext );
		    }
		};
		
	})( ko );
	
	//{{SNAME.HOLDER}}
 Firebrick.classes.addLookups( { "button.icon": "Firebrick.ui.button.Icon",
"button.togglebutton": "Firebrick.ui.button.ToggleButton",
"containers.border.pane": "Firebrick.ui.containers.border.Pane",
"containers.box": "Firebrick.ui.containers.Box",
"containers.fieldset": "Firebrick.ui.containers.Fieldset",
"containers.form": "Firebrick.ui.containers.Form",
"containers.formpanel": "Firebrick.ui.containers.FormPanel",
"containers.gridcolumn": "Firebrick.ui.containers.GridColumn",
"containers.modal": "Firebrick.ui.containers.Modal",
"containers.panel": "Firebrick.ui.containers.Panel",
"containers.tab.pane": "Firebrick.ui.containers.tab.Pane",
"display.alert": "Firebrick.ui.display.Alert",
"display.divider": "Firebrick.ui.display.Divider",
"display.header": "Firebrick.ui.display.Header",
"display.image": "Firebrick.ui.display.Image",
"display.list": "Firebrick.ui.display.List",
"display.loader": "Firebrick.ui.display.Loader",
"display.progress": "Firebrick.ui.display.Progress",
"display.span": "Firebrick.ui.display.Span",
"display.text": "Firebrick.ui.display.Text",
"fields.base": "Firebrick.ui.fields.Base",
"fields.checkbox": "Firebrick.ui.fields.Checkbox",
"fields.combobox": "Firebrick.ui.fields.ComboBox",
"fields.datepicker": "Firebrick.ui.fields.DatePicker",
"fields.display": "Firebrick.ui.fields.Display",
"fields.email": "Firebrick.ui.fields.Email",
"fields.file": "Firebrick.ui.fields.File",
"fields.hidden": "Firebrick.ui.fields.Hidden",
"fields.htmleditor": "Firebrick.ui.fields.HtmlEditor",
"fields.input": "Firebrick.ui.fields.Input",
"fields.password": "Firebrick.ui.fields.Password",
"fields.radio": "Firebrick.ui.fields.Radio",
"fields.selectbox": "Firebrick.ui.fields.SelectBox",
"fields.textarea": "Firebrick.ui.fields.TextArea",
"menu.contextmenu": "Firebrick.ui.menu.ContextMenu",
"nav.breadcrumbs": "Firebrick.ui.nav.Breadcrumbs",
"nav.list": "Firebrick.ui.nav.List",
"nav.navbar": "Firebrick.ui.nav.Navbar",
"nav.pagination": "Firebrick.ui.nav.Pagination",
"nav.toolbar": "Firebrick.ui.nav.Toolbar",
"table.table": "Firebrick.ui.table.Table",
"table.treetable": "Firebrick.ui.table.TreeTable" } );
//{{/SNAME.HOLDER}}
	
	return Firebrick;
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * Super class for all components.
 *
 * Extends from <a href="http://smasala.github.io/firebrick/docs/classes/view.Base.html">Firebrick.view.Base</a>
 * @module Firebrick.ui.components
 * @extends class.Base
 * @namespace components.common
 * @class Base
 */
define( 'Firebrick.ui/common/Base',[ "doT", "jquery", "bootstrap.plugins/tooltip", "bootstrap.plugins/popover" ], function( tplEngine, $ ) {

	"use strict";
	
	return Firebrick.define( "Firebrick.ui.common.Base", {
		extend: "Firebrick.view.Base",
		/**
		 * Override class id
		 * @property _idPrefix
		 * @private
		 * @type {String}
		 */
		_idPrefix: "fb-ui-",
		/**
		 * used when filtering component classes when searching
		 * @property uiComponent
		 * @type {Boolean}
		 * @default true
		 */
		uiComponent: true,
		/**
		 * if handler property is set, it is automatically attached to this event
		 * @property handlerEvent
		 * @type {String}
		 * @default "click"
		 */
		handlerEvent: "click",
		/**
		 * @property handler
		 * @type {Function}
		 * @default null
		 */
		handler: null,
		/**
		 * set to true to set the focus on the element after render
		 * @property autoFocus
		 * @type {Boolean}
		 * @default false
		 */
		autoFocus: false,
		/**
		 * @property glyphiconClass
		 * @type {String}
		 * @default "glyphicon"
		 */
		glyphiconClass: "glyphicon",
		/**
		 * cache
		 * @property _build
		 * @private
		 * @type {Object} map of all builds
		 * @default null
		 */
		_build: null,
		/**
		 * compiled template map
		 * @property _template
		 * @private
		 * @type {Object} map of all templates
		 * @default null
		 */
		_template: null,
		/**
		 * template
		 * @property tpl
		 * @type {String} html
		 * @default null
		 */
		tpl: null,
		/**
		 * sub template
		 * @property subTpl
		 * @type {String} html
		 * @default null
		 */
		subTpl: null,
		/**
		 * all css classes (space separated) are added to the standard bindings function
		 * @property css
		 * @type {String}
		 * @default null
		 */
		css: null,
		/**
		 * add inline css styles
		 * http://knockoutjs.com/documentation/style-binding.html
		 * @property style
		 * @type {Object}
		 * @default null
		 */
		style: null,
		/**
		 * variable shortcuts are created using the sName. by default the string after the last "-" is used
		 * @example
		 * 		sName:"fb-ui-input"
		 * 		//becomes accessible via: {Firebrick|fb}.ui.cmp.input
		 * 		//defining another component e.g "myapp-field-input" would overwrite the default input as "input" is found after the last "-"
		 * @property sName
		 * @type {String}
		 * @default null
		 */
		sName: null,
		/**
		 * @property _element
		 * @type {Null|jQuery Object}
		 * @default null
		 */
		_element: null,
		/**
		 * @property tooltip
		 * @type {Boolean|String} set to false to deactivate, string to set the text
		 * @default false
		 */
		tooltip: false,
		/**
		 * where the tooltip should appear: "top", "left", "right", "bottom"
		 * @property tooltipLocation
		 * @type {String}
		 * @default "top"
		 */
		tooltipLocation: "top",
		/**
		 * options defined by bootstrap
		 * @property tooltipOptions
		 * @type {Object}
		 * @default null
		 */
		tooltipOptions: null,
		/**
		 * @property popover
		 * @type {Boolean|String} set to false to deactivate, string to set the text
		 * @default false
		 */
		popover: false,
		/**
		 * @property popoverTitle
		 * @type {Boolean|String} optional - set to false to deactivate, string to set the title
		 * @default false
		 */
		popoverTitle: false,
		/**
		 * where the popover should appear: "top", "left", "right", "bottom"
		 * @property popoverLocation
		 * @type {String}
		 * @default "top"
		 */
		popoverLocation: "top",
		/**
		 * options defined by bootstrap
		 * @property popoverOptions
		 * @type {Object}
		 * @default null
		 */
		popoverOptions: null,
		/**
		 * @property popoverDismissible
		 * @type {Boolean}
		 * @default true
		 */
		popoverDismissible: true,
		/**
		 * @property align
		 * @type {String|null} right, left
		 * @default null
		 */
		align: null,
		/**
		 * @property contextMenu
		 * @type {Array of Objects}
		 * @default null
		 */
		contextMenu: null,
		/**
		 * @property beforeSubTpl
		 * @type {String | HTML}
		 * @default null
		 */
		beforeSubTpl: null,
		/**
		 * @property afterSubTpl
		 * @type {String | HTML}
		 * @default null
		 */
		afterSubTpl: null,
		/**
		 * pass a binding Object and this method will add the tooltip/popover relevant properties
		 * @method addTooltipPopoverBind
		 * @param bindObj {Object}
		 * @return {Object} new Object
		 */
		addTooltipPopoverBind: function( bindObj ) {
			var me = this;
			if ( me.tooltip || me.popover ) {
				if ( bindObj && $.isPlainObject( bindObj ) ) {
					if ( !bindObj.attr ) {
						bindObj.attr = {};
					}
					bindObj.attr[ "'data-toggle'" ] = me.parseBind( me.tooltip ? "tooltip" : "popover" );
					if ( me.tooltip || me.popoverTitle ) {
						bindObj.attr.title = me.textBind( me.tooltip ? "tooltip" : "popoverTitle" );
					}
					if ( me.popover ) {
						bindObj.attr[ "'data-content'" ] = me.textBind( "popover" );
						bindObj.attr[ "'data-container'" ] = "'body'";
						if ( me.popoverDismissible ) {
							bindObj.attr[ "'data-trigger'" ] = "'focus'";
						}
					}
					bindObj.attr[ "'data-placement'" ] = me.parseBind( me.tooltipLocation || me.popoverLocation );
				}
			}
			return bindObj;
		},
		/**
		 * @method _getElementSelector
		 * @private
		 * @return {String} jquery element selector string
		 */
		_getElementSelector: function() {
			var me = this,
				id = me.enclosedBind ? me.getEnclosedBindId() : me.getId();
			return "#" + id;
		},
		/**
		 * @method getElement
		 * @return {Object} jquery element object
		 */
		getElement: function() {
			var me = this;
			if ( !me._element ) {
				me._element = $( me._getElementSelector() );
				if ( !me._element.length ) {
					//set to null if jquery object returned empty []
					me._element = null;
				}
			}
			return me._element;
		},
		/**
		 * called when defining the class
		 * @method constructor
		 * @return {Any} this.callParent(arguments)
		 */
		constructor: function() {
			var me = this;
			
			me._precompile();
			
			return me.callParent( arguments );
		},
		/**
		 * compile and cache template
		 *
		 * @method _precompile
		 * @private
		 * @return {Object} self
		 */
		_precompile: function() {
			var me = this,
				it,
				tpls = [ "tpl", "beforeSubTpl", "subTpl", "afterSubTpl" ];
			
			//init objects so each class is unqiue
			me._template = {};
			me._build = {};
			
			//precompile the template as soon as possible - performance
			//http://jsperf.com/dot-vs-handlebars/2
			for ( var i = 0, l = tpls.length; i < l; i++ ) {
				it = tpls[ i ];
				if ( me[ it ] ) {
					me.template( it );
				}
			}
			return me;
		},
		/**
		 * use this as a wrapper in a template if the property you wish to call COULD be either a primitive or a function
		 * @method b
		 * @param value {String|Function}
		 * @return {String}
		 */
		b: function( value ) {
			return $.isFunction( value ) ? value.bind( this )() : value;
		},
		/**
		 * when overriding this or any other method, this.callParent(arguments) calls the method in the super class
		 * @method init
		 */
		init: function() {
			var me = this;
			
			if ( me.autoRender && me.getTarget() ) {
				me.tpl = me.build();
			}
			
			me._registerHandler();
					
			me.on( "rendered", function() {
				var $el = me.getElement();
				
				me._prepTooltipPopover();
				
				if ( me.contextMenu && !me.contextMenu._classname ) {
					require( [ "Firebrick.ui/menu/ContextMenu" ], function() {
						$el.on( "contextmenu", function( event ) {
							var conf = {
								_parent: me,
								contextMenuEvent: event
							};
							event.preventDefault();

							me._contextMenu = Firebrick.create( "Firebrick.ui.menu.ContextMenu", Firebrick.utils.overwrite( conf, me.contextMenu ) );
						});
					});
				}
				
				if ( me.autoFocus ) {
					me.focus();
				}
			});
				
			return me.callParent( arguments );
		},
		/**
		 * @method _prepTooltipPopover
		 * @return self
		 */
		_prepTooltipPopover: function() {
			var me = this,
				$el,
				offset;
			
			if ( me.tooltip || me.popover ) {
				$el = me.getElement();
				offset = $el.offset();
				
				if ( me.tooltip ) {
					$el.tooltip( me.tooltipOptions );
				}
				
				if ( me.popover ) {
					$el.popover( me.popoverOptions );
				}
			}
			
			return me;
		},
		/**
		 * set focus on element
		 * @method focus
		 */
		focus: function() {
			this.getElement().focus();
		},
		/**
		 * register handlers for element,  handlerEvent elementSelector
		 * @method _registerHandler
		 * @param elementSelector {String} optional jquery selector
		 * @param handler {Function} optional
		 * @param handlerEvent {String} optional
		 */
		_registerHandler: function( elementSelector, handler, handlerEvent ) {
			var me = this;
			handler = handler || me.handler;
			handlerEvent = handlerEvent || me.handlerEvent;
			elementSelector = elementSelector || me._getElementSelector();
			if ( handler && handlerEvent ) {
				$( document ).on( handlerEvent, elementSelector, function() {
					var args = Array.prototype.slice.call( arguments );
					args.push( this );
					handler.apply( me, args );
				});
			}
		},
		/**
		 * mother of all basic bindings
		 * @method bindings
		 * @return {Object} {attr:{}, css:{}}
		 */
		bindings: function() {
			var me = this,
				obj = {
					attr: {},
					css: {}
				};
			
			if ( me.css ) {
				obj.css[ me.parseBind( me.css ) ] = true;
			}
			
			if ( me.style ) {
				obj.style = me.style;
			}
			
			return me.addTooltipPopoverBind( obj );
		},
		/**
		 * compile the template
		 * @method template
		 * @param prop {String} [prop=tpl] optional - name of property to template
		 * @param force {Boolean} [force=false] optional - set to true to force a retemplate
		 * @return {Function} template function
		 */
		template: function( prop, force ) {
			var me = this;
			prop = prop || "tpl";
			if ( !me._template[ prop ] || force ) {
				me._template[ prop ] = tplEngine.template( me[ prop ] );
			}
			return me._template[ prop ];
		},
		/**
		 * build the compiled template
		 * @method build
		 * @param prop {String} [prop="tpl"] optional - name of property to build
		 * @return {String} html
		 */
		build: function( prop ) {
			var me = this;
			prop = prop || "tpl";
			me._build[ prop ] = me._template[ prop ]( me );
			return me._build[ prop ];
		},
		/**
		 * @method dataBind
		 * @param property {String} [property=this.bindings]
		 * @param ...
		 * @private
		 * @return {String}
		 */
		dataBind: function() {
			var me = this,
				args = Firebrick.utils.argsToArray( arguments ),
				prop,
				obj;
			
			if ( args && args.length ) {
				prop = args.splice( 0, 1 );
			} else {
				prop = "bindings";
			}
			
			obj = me[ prop ];
				
			if ( $.isFunction( obj ) ) {
				obj = obj.apply( me, args );
			}
			
			return Firebrick.ui.utils.stringify( obj );
		},
		/**
		 * called when calling {{{getSubTpl}}} in component template
		 * @method getSubTpl
		 * @return {String}
		 */
		getSubTpl: function() {
			var me = this,
				tpl = me.build( "subTpl" );
			
			if ( me.beforeSubTpl ) {
				tpl = me.build( "beforeSubTpl" ) + tpl;
			}
			if ( me.afterSubTpl ) {
				tpl = tpl + me.build( "afterSubTpl" );
			}
			
			return tpl;
		},
		/**
		 * find the parent of this class
		 * iterate up the inheritance tree looking for a classname that differs from the current and that "subTpl" or "tpl" don't match either
		 * @private
		 * @method _getParent
		 * @return {Object}
		 */
		_getParent: function( clazz ) {
			var me = clazz || this,
				p = Object.getPrototypeOf( me );

			if ( me._classname !== p._classname ) {
				if ( ( me.subTpl !== p.subTpl ) || ( me.tpl !== p.tpl ) ) {
					return p;
				}
			}
			return this._getParent( p );
		},
		/**
		 * called when calling {{{getParentTpl}}} in component template
		 * @method getParentTpl
		 * @return {String}
		 */
		getParentTpl: function() {
			var me = this;
			return tplEngine.template( me._getParent().tpl )( me );
		},
		/**
		 * called when calling {{{getParentSubTpl}}} in component template
		 * @method getParentSubTpl
		 * @return {String}
		 */
		getParentSubTpl: function() {
			var me = this;
			return tplEngine.template( me._getParent().subTpl )( me );
		},
		/**
		 * clean string - i.e. remove all ' from string
		 * @method cleanString
		 * @return {String}
		 */
		cleanString: function( string ) {
			return string.replace( /\'/g, "" );
		},
		/**
		 * attach ' to the start and end of the string for KO binds
		 * @method parseBind
		 * @param  {String} str
		 * @return {String} "'" + str + "'"
		 */
		parseBind: function( str ) {
			return "'" + str + "'";
		},
		/**
		 * takes a string and prepares it for Firebrick text call
		 * @example
		 * 	textBind("mystring.abc.key")
		 * 	// returns = Firebrick.text('mystring.abc.key')
		 * @method textBind
		 * @param key {String} property key of the class to call
		 * @return {String}
		 */
		textBind: function( key ) {
		    var me = this,
		        id = me.getId();
			return "Firebrick.text( Firebrick.getById('" + id + "')[" + me.parseBind( key ) + "] )";
		}
	});
});
	
/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Items
 * @static
 */
define( 'Firebrick.ui/common/mixins/Items',[], function( ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.common.mixins.Items", {
		/**
		 * default configuration for direct children - i.e. direct items
		 * @property defaults
		 * @type {Object}
		 * @default null
		 */
		defaults: 1,
		/**
		 * alignment of its children components
		 * @property itemsAlign
		 * @type {String|null} "center"
		 * @default
		 */
		itemsAlign: null,
		/**
		 * @property items
		 * @type {String|Object|Array of Object}
		 * @default null
		 */
		items: null,
		/**
		 * inject sub items
		 * @method getItems
		 * @return {String} html
		 */
		getItems: function() {
			var me = this,
				r = me._getItems( me.items );
				me.items = r.items;
			return r.html;
		},
		/**
		 * if you are calling _getItems from a nested scope or you want items from a different property other than .items - then use this function
		 * @method _getItemsScoped
		 * @param me {Object} me component class (this)
		 * @param [itemsName] {String}  name of property to get items from
		 * @return {String} html
		 */
		getItemsProp: function( itemsName ) {
			var me = this,
				r,
				html = "";
			if ( itemsName ) {
				r = me._getItems( me[ itemsName ] );
				me[ itemsName ] = r.items;
				html = r.html;
			} else {
				console.error( "invalid function call getItemsProp():", itemsName );
			}
			
			return html;
		},
		/**
		 * use getItems
		 * @private
		 * @method _getItems
		 * @param {Object|Array of Objects} items
		 * @return {Object, Null} object - {html:"", items:[]}
		 */
		_getItems: function( items ) {
			return Firebrick.ui._populate( items, this );
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 *
 * do not extend from this but from Firebrick.ui.button.ButtonGroup
 *
 * @private
 *
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.button
 * @class ButtonGroupBase
 */
define( 'Firebrick.ui/button/Base',[ "../common/Base", "../common/mixins/Items" ], function() {
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.button.Base", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Items"
	});
	
});


define('text!Firebrick.ui/button/Button.html',[],function () { return '{{?it.items}}\r\n\t<div data-bind="{{=it.dataBind(\'dropdownContainerBindings\')}}">\r\n{{?}}\r\n\t\t<button id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t\t\t\r\n\t\t\t{{=it.b(it.beforeText)}}\r\n\t\t\t<span data-bind="{{=it.dataBind(\'buttonTextBindings\')}}"></span>\r\n\t\t\t{{=it.b(it.afterText)}}\r\n\t\t\t\r\n\t\t\t{{?it.badge}}\r\n\t\t\t\t<span data-bind="{{=it.dataBind(\'badgeBindings\')}}"></span>\r\n\t\t\t{{?}}\r\n\t\t\t\r\n\t\t\t{{?it.items && !it.splitButton}}\r\n\t\t\t\t<span data-bind="{{=it.dataBind(\'caretBindings\')}}"></span>\r\n\t\t\t{{?}}\r\n\t\t</button>\r\n\t\t \r\n\t\t {{?it.items && it.splitButton}}\r\n\r\n\t\t\t<button data-bind="{{=it.dataBind(\'splitButtonBindings\')}}">\r\n\t\t\t    <span data-bind="{{=it.dataBind(\'caretBindings\')}}"></span>\r\n\t\t\t    <span data-bind="{{=it.dataBind(\'splitButtonSrOnlyBinding\')}}"></span>\r\n\t\t\t  </button>\r\n\t\t \r\n\t\t {{?}}\r\n\t\t \r\n{{?it.items}}\r\n\t\t{{=it.getDropdown()}}\r\n\t</div>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Badges
 * @static
 */
define( 'Firebrick.ui/common/mixins/Badges',[], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.common.mixins.Badges", {
		/**
		 * false to hide badge, string to show text
		 * @property badge
		 * @type {String|False}
		 * @default false
		 */
		badge: false,
		/**
		 * @method badgeBindings
		 * @return {Object}
		 */
		badgeBindings: function() {
			var me = this,
				obj = {
					attr: {},
					css: {
						badge: true
					},
					text: me.textBind( "badge" )
				};
			return obj;
		}
	});
});


define('text!Firebrick.ui/menu/Menu.html',[],function () { return '<ul id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{=it.getItems()}}\r\n</ul>';});


define('text!Firebrick.ui/menu/Item.html',[],function () { return '<li id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{?it.items}}\r\n\t\t{{=it.getItems()}}\r\n\t{{?? true}}\r\n\t\t<a data-bind="{{=it.dataBind(\'linkBindings\')}}"></a>\r\n\t{{?}}\r\n</li>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @private
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.menu
 * @class Item
 */
define( 'Firebrick.ui/menu/Item',[ "text!./Item.html", "../common/Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.menu.Item", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Items",
		sName: "menu.item",
		text: null,
		value: null,
		href: null,
		divider: false,
		tpl: tpl,
		/**
		 * @property defaults
		 * @type {object}
		 * @default {
		 * 		sName: "menu.item"
		 * }
		 */
		defaults: {
			sName: "menu.item"
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( me.divider ) {
				obj.css.divider = true;
			}
			
			obj.attr.role = "'presentation'";
			
			return obj;
		},
		/**
		 * @method linkBindings
		 * @return {Object}
		 */
		linkBindings: function() {
			var me = this,
				obj = {
					attr: {}
				};
			
			if ( me.href ) {
				obj.href = me.href;
			}
			if ( me.text ) {
				obj.text = me.textBind( "text" );
			}
			
			obj.attr.role = "'menuitem'";
			obj.attr.tabindex = "-1";
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @private
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.menu
 * @class Menu
 */
define( 'Firebrick.ui/menu/Menu',[ "text!./Menu.html", "../common/Base", "../common/mixins/Items", "./Item" ], function( tpl ) {
	"use strict";

	return Firebrick.define( "Firebrick.ui.menu.Menu", {
	    extend: "Firebrick.ui.common.Base",
	    mixins: "Firebrick.ui.common.mixins.Items",
	    /**
	     * @property sName
	     * @type {String}
	     * @default "menu.list",
	     */
	    sName: "menu.menu",
	    /**
	     * @property tpl
	     */
	    tpl: tpl,
	    /**
	     * @property defaults
	     * @type {object}
	     * @default {
	     * 		sName: "menu.item"
	     * }
	     */
	    defaults: {
		    sName: "menu.item"
	    },
	    /**
	     * @property ariaLabelledBy
	     * @type {String}
	     * @default ""
	     */
	    ariaLabelledBy: "",
	    /**
	     * @method init
	     */
	    init: function() {
		    var me = this;

		    me._prepItems();

		    return me.callParent( arguments );
	    },
	    /**
	     * @method _prepItems
	     * @private
	     */
	    _prepItems: function() {
		    var me = this, it, items = me.items;

		    for ( var i = 0, l = items.length; i < l; i++ ) {
			    it = items[ i ];
			    if ( it === "|" ) {
				    it = {
					    divider: true
				    };
			    } else if ( it.sName && it.sName !== "menu.item" ) {
				    it = {
					    items: [ items[ i ] ]
				    };
			    }

			    items[ i ] = it;
		    }
	    },
	    /**
	     * @method bindings
	     * @return {Object}
	     */
	    bindings: function() {
		    var me = this, obj = me.callParent( arguments );
		    obj.css = {
			    "'dropdown-menu'": true
		    };
		    if ( !obj.attr ) {
			    obj.attr = {};
		    }
		    obj.attr.role = "'menu'";
		    obj.attr[ "'aria-labelledby'" ] = me.parseBind( me.ariaLabelledBy );

		    return obj;
	    }
	} );
} );

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.button.Base
 * @namespace components.button
 * @class Button
 */
define( 'Firebrick.ui/button/Button',[ "text!./Button.html", "./Base", "../common/mixins/Badges", "../menu/Menu" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.button.Button", {
		extend: "Firebrick.ui.button.Base",
		mixins: [ "Firebrick.ui.common.mixins.Badges" ],
		sName: "button.button",
		tpl: tpl,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text: "",
		/**
		 * type: button, submit
		 * @property type
		 * @type {String}
		 * @default "button"
		 */
		type: "button",
		/**
		 * @property dropdownContainerClass
		 * @type {String|false}
		 * @default "dropdown"
		 */
		dropdownContainerClass: "dropdown",
		/**
		 * if true - att "navbar-btn" class to the button
		 * @property navbarItem
		 * @type {Boolean}
		 * @default false
		 */
		navbarItem: false,
		/**
		 * @property splitButton
		 * @type {Boolean}
		 * @default false
		 */
		splitButton: false,
		/**
		 * @property btnSize
		 * @type {Boolean|String} false |  ("sm", "lg", "xs")
		 * @default false
		 */
		btnSize: false,
		/**
		 * @property disabled
		 * @type {Boolean}
		 * @default false
		 */
		disabled: false,
		/**
		 * @property btnStyle
		 * @type {Boolean|String} false | (default, primary, success, info, warning, danger, link)
		 * @default "default"
		 */
		btnStyle: "default",
		/**
		 * used to inject something before the text <span>
		 * @property beforeText
		 * @type {Any}
		 * @default ""
		 */
		beforeText: "",
		/**
		 * bootstrap glyphicon class
		 * @property glyIcon
		 * @type {String}
		 * @default null
		 */
		glyIcon: null,
		/**
		 * used to inject something after the text <span>
		 * @property afterText
		 * @type {Any}
		 * @default ""
		 */
		afterText: "",
		/**
		 * set as string to give the button stateful capabilities.
		 * @property loadingText
		 * @type {Boolean|String} when set as string, the value is assigned to the button "button-loading-text" attribute
		 * @default false
		 */
		loadingText: false,
		/**
		 * @property dropdownConfig
		 * @type {Object}
		 * @default null
		 */
		dropdownConfig: null,
		/**
		 * @property srOnlyText
		 * @type {String}
		 * @default "Toggle Dropdown"
		 */
		srOnlyText: "Toggle Dropdown",
		/**
		 * only works if this button is used in a modal
		 * @property closeModal
		 * @type {Boolean}
		 * @default false
		 */
		closeModal: false,
		/**
		 * use getDropdownParentEl()
		 * @property _dropdown
		 * @private
		 * @type {jQuery Object}
		 * @default null
		 */
		_dropdownParent: null,
		/**
		 * @method getDropdownParentEl
		 * @return {jQuery Object}
		 */
		getDropdownParentEl: function() {
			var me = this,
				el;
			
			if ( !me._dropdownParent ) {
				el = me.getElement();
				me._dropdownParent = el.parent();
			}
			
			return me._dropdownParent;
		},
		/**
		 * use getDropdownEl()
		 * @property _dropdown
		 * @private
		 * @type {jQuery Object}
		 * @default null
		 */
		_dropdown: null,
		/**
		 * @method getDropdownEl
		 * @return {jQuery Object}
		 */
		getDropdownEl: function() {
			var me = this,
				el;
			if ( !me._dropdown ) {
				el = me.getElement();
				me._dropdown = el.siblings( "ul.dropdown-menu" );
			}
			
			return me._dropdown;
		},
		/**
		 * @method init
		 */
		init: function() {
			var me = this;
			
			me._initDropdown();
			
			return me.callParent( arguments );
		},
		/**
		 * @method _initDropdown
		 * @private
		 */
		_initDropdown: function() {
			var me = this;
			if ( me.items && me.items.length ) {
				me.on( "rendered", function() {
					var el = me.getDropdownParentEl();
					if ( el.length ) {
						el.on( "shown.bs.dropdown", function() {
							me.positionDropdown();
						});
					}
				});
			}
		},
		/**
		 * @method positionDropdown
		 */
		positionDropdown: function() {
			var me = this,
				el = me.getElement(),
				drop = me.getDropdownEl(),
				docWidth = $( document ).width(),
				elOffset = el.offset(),
				startLeft = elOffset.left,
				dropWidth = drop.outerWidth(),
				elWidth = el.outerWidth(),
				diff = dropWidth - elWidth;
			
			if ( dropWidth > elWidth ) {
				if ( ( elOffset.left + dropWidth ) > docWidth ) {
					startLeft = elOffset.left - diff;
				}
			}
			
			drop.css({
				top: elOffset.top + el.outerHeight(),
				left: startLeft
			});
			
		},
		/**
		 * default bindings called by data-bind={{data-bind}}
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.attr.type = me.parseBind( me.type );
			obj.css.btn = true;
			
			//firefox bug fix
			obj.attr.autocomplete = "'off'";
			//--//
						
			if ( me.btnStyle ) {
				obj.css[ me.parseBind( "btn-" + me.btnStyle ) ] = true;
			}
			if ( me.btnSize ) {
				obj.css[ me.parseBind( "btn-" + me.btnSize ) ] = true;
			}
			
			if ( me.items && !me.splitButton ) {
				obj.css[ "'dropdown-toggle'" ] = true;
				obj.attr[ "'data-toggle'" ] = "'dropdown'";
			}
			
			if ( me.navbarItem ) {
				obj.css[ "'navbar-btn'" ] = true;
			}
			
			if ( me.loadingText ) {
				obj.attr[ "'data-loading-text'" ] = me.textBind( "loadingText" );
			}
			
			if ( me.closeModal ) {
				obj.attr[ "'data-dismiss'" ] = "'modal'";
			}
			
			if ( me.disabled ) {
				obj.attr.disabled = "'disabled'";
			}
			
			return obj;
		},
		/**
		 * @property buttonTextBindings
		 * @return {Object}
		 */
		buttonTextBindings: function() {
			var me = this,
				obj = {
						css: {},
						text: me.textBind( "text" )
				};
			
			if ( me.glyIcon ) {
				obj.css.glyphicon = true;
				obj.css[ me.parseBind( "glyphicon-" + me.glyIcon ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method caretBindings
		 * @return {Object}
		 */
		caretBindings: function() {
			return {
				css: {
					caret: true
				}
			};
		},
		/**
		 * @method dropdownContainerBindings
		 * @return {Object}
		 */
		dropdownContainerBindings: function() {
			var me = this,
				obj = {
					css: {}
				};
			
			if ( me.splitButton ) {
				obj.css[ "'btn-group'" ] = true;
			} else {
				//standard dropdown
				if ( me.dropdownContainerClass && !me.splitButton ) {
					obj.css[ me.parseBind( me.dropdownContainerClass ) ] = true;
				}
			}

			obj.css[ "'fb-ui-dropdown'" ] = true;
			
			return obj;
		},
		/**
		 * @method getDropdown
		 * @return {Object}
		 */
		getDropdown: function() {
			var me = this,
				obj = {
					sName: "menu.menu",
					items: me.items
				};
			
			obj = Firebrick.utils.copyover( obj, me.dropdownConfig || {});

			obj = me._getItems( obj );
			
			me.items = obj.items;
			
			return obj.html;
		},
		
		/**
		 * @method splitButtonBindings
		 * @return {Object}
		 */
		splitButtonBindings: function() {
			var me = this,
				obj = { css: {}, attr: {} };
			
			obj.attr.type = me.parseBind( me.type );
			obj.css.btn = true;
			if ( me.btnStyle ) {
				obj.css[ me.parseBind( "btn-" + me.btnStyle ) ] = true;
			}
			if ( me.btnSize ) {
				obj.css[ me.parseBind( "btn-" + me.btnSize ) ] = true;
			}
			if ( me.items ) {
				obj.css[ "'dropdown-toggle'" ] = true;
				obj.attr[ "'data-toggle'" ] = "'dropdown'";
			}
			obj.attr[ "'aria-expanded'" ] = false;
			
			return obj;
		},
		
		/**
		 * @method splitButtonSrOnlyBinding
		 * @return {Object}
		 */
		splitButtonSrOnlyBinding: function() {
			var me = this,
				obj = { css: {} };
			
			obj.css[ "'sr-only'" ] = true;
			obj.text = me.textBind( "srOnlyText" );
			
			return obj;
		},
		/**
		 * @method setEnabled
		 * @event enabled
		 * @event disabled
		 * @param enable {Boolean}
		 */
		setEnabled: function( enable ) {
			var me = this,
				$el = me.getElement();
			if ( enable ) {
				$el.removeAttr( "disabled" );
				me.fireEvent( "enabled" );
			} else {
				$el.attr( "disabled", "disabled" );
				me.fireEvent( "disabled" );
			}
		}
	});
});


define('text!Firebrick.ui/button/ButtonGroup.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\r\n\t{{=it.getItems()}}\r\n\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 *
 * the items property does not need to have each object defined with its sName, that is down automatically
 *
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.button
 * @class ButtonGroup
 */
define( 'Firebrick.ui/button/ButtonGroup',[ "text!./ButtonGroup.html", "./Base", "./Button" ], function( tpl ) {
	"use strict";

	return Firebrick.define( "Firebrick.ui.button.ButtonGroup", {
		extend: "Firebrick.ui.button.Base",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-buttongroup"
		 */
		sName: "button.buttongroup",
		tpl: tpl,
		defaults: {
			sName: "button.button",
			dropdownContainerClass: "btn-group" //needed for dropdown
		},
		/**
		 * @property vertical
		 * @type {Boolean} if false then the button group is horizontal
		 * @default true
		 */
		vertical: true,
		/**
		 * @property role
		 * @type {String}
		 * @default "group"
		 */
		role: "group",
		/**
		 * @property groupSize
		 * @type {String} xs, sm, md, lg
		 * @default "md"
		 */
		groupSize: "md",
		/**
		 * @property arialLabel
		 * @type {String}
		 * @default ""
		 */
		arialLabel: "",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( me.vertical ) {
				obj.css[ "'btn-group-vertical'" ] = true;
			} else {
				obj.css[ "'btn-group'" ] = true;
			}
			
			obj.css[ me.parseBind( "btn-group-" + me.groupSize ) ] = true;
			obj.attr.role = me.parseBind( me.role );
			obj.attr[ "'aria-label'" ] = me.textBind( "arialLabel" );
			
			return obj;
		}
	});
});
		
/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.button.Button
 * @namespace components.button
 * @class Icon
 */
define( 'Firebrick.ui/button/Icon',[ "./Button" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.button.Icon", {
		extend: "Firebrick.ui.button.Button",
		sName: "button.icon",
		/**
		 * @property buttonSize
		 * @type {Boolean|String} boolean = false
		 * @default "xs"
		 */
		btnSize: "xs",
		/**
		 * @property text
		 * @type {String}
		 * @default false
		 */
		text: false,
		/**
		 * @property glyIcon
		 * @type {String}
		 * @default "remove"
		 */
		glyIcon: "remove",
		/**
		 * @property btnStyle
		 * @type {String}
		 * @default "danger"
		 */
		btnStyle: "danger",
		/**
		 * @property afterText
		 * @private
		 * @type {Function}
		 */
		afterText: function() {
			var me = this;
			return me.text ? me.text : "";
		},
		/**
		 * @method buttonTextBindings
		 * @return {Object}
		 */
		buttonTextBindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( obj.hasOwnProperty( "text" ) ) {
				delete obj.text;
			}
			
			if ( !obj.css ) {
				obj.css = {};
			}
			obj.css[ me.glyphiconClass ] = true;
			obj.css[ me.parseBind( "glyphicon-" + me.glyIcon ) ] = true;
			
			return obj;
		}
		
	});
});


define('text!Firebrick.ui/button/ToggleButton.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind(\'btnGroupBindings\')}}">\r\n\t{{?it.showLabel}}\r\n\t\t<label data-bind="{{=it.dataBind(\'toggleLabelBindings\')}}">\r\n\t{{?}}\r\n\t\t\t<input type="radio" data-bind="{{=it.dataBind(\'toggleInputBindings\')}}"><span data-bind="{{=it.dataBind(\'toggleLabelTextBindings\')}}"></span>\r\n\t{{?it.showLabel}}\r\n\t\t</label>\r\n\t{{?}}\r\n</div>';});


define('text!Firebrick.ui/fields/Base.html',[],function () { return '<div data-cmp-id="{{=it.getId()}}" class="{{=it.formGroupClass}}" data-bind="{{=it.dataBind(\'containerBindings\')}}">\r\n\t{{?it.label !== false }}\r\n\t\t<label for="{{=it.getId()}}" data-bind="{{=it.dataBind(\'labelBindings\')}}"></label> \r\n\t{{?}}\r\n\t<div data-bind="{{=it.dataBind(\'inputContainerBindings\')}}">\r\n\t\t<div data-bind="{{=it.dataBind(\'fieldBindings\')}}">\r\n\t\t\t\t\r\n\t\t\t\t{{?it.inputAddon}}\r\n\t\t\t\t\t{{?it.inputAddonPosition === "left"}}\r\n\t\t\t\t\t\t<!-- ko {{=it.dataBind(\'inputAddonTemplateBindings\')}} --><!-- /ko -->\r\n\t\t\t\t\t{{?}}\r\n\t\t\t\t{{?}}\r\n\t\t\t\t\r\n\t\t\t\t{{=it.getSubTpl()}}\r\n\t\t\t\t\r\n\t\t\t\t{{?it.showStateIcon}}\r\n\t\t\t\t\t<span class="{{=it.glyphiconClass}} {{=it.formControlFeedbackClass}}" data-bind="{{=it.dataBind(\'feedbackBindings\')}}"></span>\r\n\t\t\t\t{{?}}\r\n\t\t\t\t{{?it.helpText}}\r\n\t\t\t\t\t<span class="{{=it.helpBlockClass}}" data-bind="{{=it.dataBind(\'helpBlockBindings\')}}"></span>\r\n\t\t\t \t{{?}}\r\n\t\t\t \t\r\n\t\t\t \t{{?it.inputAddon}}\r\n\t\t\t\t \t{{?it.inputAddonPosition === "right"}}\r\n\t\t\t\t\t\t<!-- ko {{=it.dataBind(\'inputAddonTemplateBindings\')}} --><!-- /ko -->\r\n\t\t\t\t\t{{?}}\r\n\t\t\t\t{{?}}\r\n\t\t\t \t\r\n\t\t</div>\r\n\t\t\r\n\t\t{{?it.inputAddon}}\r\n\t\t \t<script type="text/html" id="{{=it.getAddonId()}}">\r\n\t\t\t\t<span data-bind="{{=it.dataBind(\'inputAddonBindings\')}}">\r\n\t\t\t\t\t{{?typeof it.inputAddon === "object"}}\r\n\t\t\t\t\t\t{{=it.getItemsProp(\'inputAddon\')}}\r\n\t\t\t\t\t{{?? true}}\r\n\t\t\t\t\t\t<span data-bind="{{=it.dataBind(\'inputAddonSpanBindings\')}}"></span>\r\n\t\t\t\t\t{{?}}\r\n\t\t\t\t</span>\r\n\t\t\t </script>\r\n\t \t{{?}}\r\n\t\t\r\n\t</div>\r\n</div>';});


define('text!Firebrick.ui/fields/Input.html',[],function () { return '{{?it.inplaceEdit}}\r\n\t<a id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}"></a>\r\n{{?? true }}\r\n\t<input id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n{{?}}\r\n';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.fields
 * @class Base
 */
define( 'Firebrick.ui/fields/Base',[ "../common/Base" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Base", {
		extend: "Firebrick.ui.common.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.base",
		/**
		 * override method to fire events on actual element - append fb.ui. to event name
		 * @method fireEvent
		 */
		fireEvent: function() {
			var me = this,
				$el = me.getElement(),
				args = Firebrick.utils.argsToArray( arguments ),
				eventName = args[ 0 ];
			
			if ( $el ) {
				//remove eventName from args
				args.splice( 0, 1 );
				//trigger event on the element - getElement()
				$el.trigger( "fb.ui." + eventName, args );
			}
			
			return me.callParent( arguments );
		}
	});
});


define('text!Firebrick.ui/containers/GridRow.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\r\n\t{{~ it.items :value:index}}\r\n\t\t{{=it.getGridItem(index, value)}}\r\n\t{{~}}\r\n\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.containers
 * @uses components.common.mixins.Items
 * @class Base
 */
define( 'Firebrick.ui/containers/Base',[ "../common/Base", "../common/mixins/Items" ], function() {
	
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.containers.Base", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Items",
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );

			//property mixed in by mixins.Items
			if ( me.itemsAlign ) {
				obj.css[ me.parseBind( "fb-ui-items-align-" + me.itemsAlign ) ] = true;
			}
			
			return obj;
		}
	});
});


define('text!Firebrick.ui/containers/GridColumn.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{=it.getItems()}}\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Column
 * @static
 */
define( 'Firebrick.ui/common/mixins/Column',[], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.common.mixins.Column", {

		/**
		 * @property deviceSize
		 * @type {String}
		 * @default "md"
		 */
		deviceSize: "md",
		/**
		 * auto will attempt to provide the column width by dividing the number of items in the parent Grid by 12 - decimals will be rounded down
		 * @property columnWidth
		 * @type {Integer|String} number 1 to 12 or "auto"
		 * @default "auto"
		 */
		columnWidth: "auto",
		/**
		 * use this to offset the column by x columns
		 * http://getbootstrap.com/css/#grid-offsetting
		 * @property columnOffset
		 * @type {Integer|null} 1 to 12
		 * @default null
		 */
		columnOffset: null,
		/**
		 * use this to offset the column by x columns
		 * http://getbootstrap.com/css/#grid-column-ordering
		 * @example
		 * 		pull-3
		 * @example
		 * 		push-4
		 * @property columnOrder
		 * @type {String|null} "push-{x}" or "pull-{x}" - x = 1 to 12
		 * @default null
		 */
		columnOrder: null,
		/**
		 * when property columnWidth is set to "auto", this function will attempt to calculate the correct size for each column.
		 * Note: this function will round down to the nearest whole number - 5 columns will result in size 2 for each column
		 * the number of columns are divided by 12 (BS3 grid)
		 * @method _getColumnWidth
		 * @private
		 * @return {Int}
		 */
		_getColumnWidth: function() {
			var me = this,
				colWidth = me.columnWidth;
			if ( colWidth === "auto" ) {
				return Math.floor( 12 / me._parent.items.length );
			}
			return colWidth;
		},
		
		/**
		 * call this in bindings function
		 * @method calColumn
		 * @param {Object} obj
		 * @param {Object} obj.css: {}
		 * @param {Object} obj.attr: {}
		 * @return {Object}
		 */
		calColumn: function( obj ) {
			var me = this;
			
			obj.css.col = true;
			obj.css[ me.parseBind( "col-" + me.deviceSize + "-" + me._getColumnWidth() ) ] = true;
			
			if ( me.columnOffset ) {
				obj.css[ me.parseBind( "col-" + me.deviceSize + "-offset-" + me.columnOffset ) ] = true;
			}
			
			if ( me.columnOrder ) {
				obj.css[ me.parseBind( "col-" + me.deviceSize + "-" + me.columnOrder ) ] = true;
			}
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class GridColumn
 */
define( 'Firebrick.ui/containers/GridColumn',[ "text!./GridColumn.html", "./Base", "../common/mixins/Column" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.GridColumn", {
		extend: "Firebrick.ui.containers.Base",
		mixins: "Firebrick.ui.common.mixins.Column",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.gridcolumn",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this;
			return me.calColumn( me.callParent( arguments ) );
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class GridRow
 */
define( 'Firebrick.ui/containers/GridRow',[ "text!./GridRow.html", "./Base", "./GridColumn" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.GridRow", {
		extend: "Firebrick.ui.containers.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.gridrow",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @property rowClass
		 * @type {Boolean|String}
		 * @default true
		 */
		rowClass: true,
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {sName: "containers.gridcolum"}
		 */
		defaults: {
			sName: "containers.gridcolumn"
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css.row = me.rowClass;
			
			return obj;
		},
		/**
		 * @method getBasicBindings
		 * @return {Object}
		 */
		getBasicBindings: function() {
			var me = this,
				obj = {
						css: {}
				};
			obj.css[ me.parseBind( "col-md-" + ( Math.floor( 12 / me.items.length ) ) ) ] = true;
			return obj;
		},
		/**
		 * used when calling {{{getGridItem}}} in template
		 * @method getGridItem
		 * @param {Int} iteration index
		 * @param {Object} iteration object
		 * @param {Context} iteration context
		 * @return {String}
		 */
		getGridItem: function( index, item ) {
			var me = this,
				newItem = me._getItems( item );
			
			if ( newItem ) {
				//replace items with the new object - _getItems returns an object {html:"", items:[]}
				me.items[ index ] = newItem.items[ 0 ];
				
				return newItem.html;
			}
			return "";
		}
	});
});


define('text!Firebrick.ui/containers/Box.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{?it.items}}\r\n\t\t{{=it.getItems()}}\r\n\t{{?}}\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Box
 */
define( 'Firebrick.ui/containers/Box',[ "text!./Box.html", "./Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Box", {
		extend: "Firebrick.ui.containers.Base",
		tpl: tpl,
		sName: "containers.box",
		/**
		 * set as string to fill the div/box with html content
		 * @property html
		 * @type {String|false}
		 * @default false
		 */
		html: null,
		/**
		 * set as string to fill the div/box with text content
		 * @property text
		 * @type {String|false}
		 * @default false
		 */
		text: null,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				id = me.getId(),
				obj = me.callParent( arguments );
			if ( me.text ) {
				obj.text = "Firebrick.text( Firebrick.getById('" + id + "').text )";
			} else if ( me.html ) {
				obj.html = "Firebrick.getById('" + id + "').html";
			}
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module plugins
 * @namespace plugins
 * @class InplaceEdit
 */
define( 'Firebrick.ui/fields/plugins/InplaceEdit',[ "jquery", "knockout", "Firebrick.ui/containers/GridRow", "Firebrick.ui/containers/Box", "Firebrick.ui/button/Icon" ], function( $, ko ) {
	"use strict";

	return Firebrick.define( "Firebrick.ui.fields.plugins.InplaceEdit", {
	    /**
	     * @property fieldItem
	     * @type {Firebrick UI Object}
	     */
	    fieldItem: null,
	    /**
	     * optional
	     * @property items
	     * @type {Array of Objects}
	     */
	    items: null,
	    /**
	     * @property showInplaceTitle
	     * @type {Boolean}
	     */
	    showInplaceTitle: true,
	    /**
	     * @property inplaceTitle
	     * @type {String}
	     * @default null
	     */
	    title: null,
	    /**
	     * @property container
	     * @type {String}
	     * @default "body"
	     */
	    container: "body",
	    /**
	     * css width of the popover
	     * @property width
	     * @type {String}
	     * @default "250px"
	     */
	    width: "250px",
	    /**
	     * popover placement
	     * @property placement
	     * @type {String|Function}
	     * @default "auto"
	     */
	    placement: "auto bottom",
	    /**
	     * set to true to place at the bottom of the popover rather than the top
	     * @property actionButtonsFooter
	     * @type {Boolean}
	     * @default false
	     */
	    actionButtonsFooter: false,
	    /**
	     * @method _getPopoverEl
	     * @private
	     * @return {jQuery Object}
	     */
	    _getPopoverEl: function() {
		    var me = this;
		    return me.fieldItem.getElement().data( "bs.popover" ).$tip;
	    },
	    /**
	     * @method init
	     */
	    init: function() {
		    var me = this, $el = me.fieldItem.getElement();
		    if ( $el ) {
			    $el.on( "click", function() {
				    return me.onEditClick.apply( me, arguments );
			    } );
			    me.fieldItem.on( "changed", function() {
				    $el.addClass( "fb-ui-inplaceedit-changed" );
			    } );
		    } else {
			    console.info( "no el", me );
		    }
	    },
	    /**
	     * @method buildItems
	     * @return {Array of Objects}
	     */
	    buildItems: function() {
		    var me = this, items = [], type = me.fieldItem.type, field, valStr = "Firebrick.getById('" + me.fieldItem.getId() + "').getValue()", tmp;
		    if ( me.items ) {
			    items = me.items;
		    } else {
			    field = {
			        css: "fb-ui-inplaceedit-field",
			        inputSize: "sm",
			        label: false,
			        inputWidth: 12
			    };
			    if ( type === "text" ) {
				    tmp = {
				        sName: "fields.input",
				        value: valStr
				    };
			    } else if ( type === "select" ) {
				    tmp = {
				        sName: "fields.selectbox",
				        options: me.fieldItem.options
				    };
				    if ( me.fieldItem.multiSelect ) {
					    tmp.selectedOptions = valStr;
				    } else {
					    tmp.value = valStr;
				    }
			    }
			    items.push( Firebrick.utils.overwrite( field, tmp ) );
		    }
		    return items;
	    },
	    /**
	     * @method showPopover
	     */
	    showPopover: function() {
		    var me = this;
		    me._initBSPopover();
		    me._showBSPopover();
		    me._initPopoverContent();
	    },
	    /**
	     * @method _initPopoverContent
	     */
	    _initPopoverContent: function() {
		    var me = this;
		    Firebrick.create( "Firebrick.ui.containers.GridRow", {
		        target: $( ".popover-content", me._getPopoverEl() ),
		        store: ko.dataFor( me.fieldItem.getElement()[ 0 ] ),
		        items: [ {
		            columnWidth: me.actionButtonsFooter ? 12 : 7,
		            items: me.buildItems()
		        }, {
		            columnWidth: me.actionButtonsFooter ? 12 : 5,
		            items: me.actionButtons()
		        } ]
		    } );
	    },
	    /**
	     * initialises the bootstrap popover - doesn't show it though
	     * @method _initBSPopover
	     */
	    _initBSPopover: function() {
		    var me = this, title = Firebrick.text( me.showInplaceTitle ? ( me.fieldItem.popoverTitle || me.fieldItem.label || "" ) : "" ); //don't use title directly here, because it is also used for popup

		    me.fieldItem.getElement().popover( {
		        html: true,
		        title: title || " ",
		        container: me.container, //so it has the right z-index
		        placement: me.placement,
		        trigger: "manual"
		    } );

	    },

	    /**
	     * shows the actually bootstrap popover
	     * @method _showBSPopover
	     */
	    _showBSPopover: function() {
		    var me = this, $popover, $fieldItem = me.fieldItem.getElement();

		    $fieldItem.popover( "toggle" );

		    $popover = me._getPopoverEl();
		    if ( me.width ) {

			    $popover.css( "width", me.width );
			    $popover.css( "max-width", me.width );
		    }

		    me._initDismissEvent();
	    },
	    /**
	     * dismisses the popover when clicked out side it
	     * @method _initDismissEvent
	     */
	    _initDismissEvent: function() {
		    var me = this;
		    //delay because otherwise it catches the <a> click on opening the popover
		    Firebrick.delay( function() {
			    var func = function( event ) {
				    var $el = $( event.target );
				    if ( !$el.closest( ".popover" ).length ) {
					    me.fieldItem.getElement().popover( "destroy" );
					    $( "html" ).off( "click", func );
				    }
			    };
			    $( "html" ).on( "click", func );
			    me.fieldItem.getElement().on( "hide.bs.popover hidden.bs.popover", function() {
				    $( "html" ).off( "click", func );
			    } );
		    }, 1 );
	    },
	    /**
	     * @method okAction
	     */
	    okAction: function() {
		    var me = this;
		    me.setValue( me.getValue() );
		    me.fieldItem.getElement().popover( "toggle" );
	    },

	    /**
	     * @method cancelAction
	     */
	    cancelAction: function() {
		    var me = this;
		    me.fieldItem.getElement().popover( "destroy" );
	    },

	    /**
	     * @method actionButtons
	     * @return {Array of Objects}
	     */
	    actionButtons: function() {
		    var me = this;
		    return [ {
		        sName: "containers.box",
		        css: me.actionButtonsFooter ? "pull-right" : "",
		        items: [ {
		            sName: "button.button",
		            glyIcon: "ok",
		            btnStyle: "primary",
		            btnSize: "sm",
		            handler: function() {
			            return me.okAction.apply( me, arguments );
		            }
		        }, {
		            sName: "button.button",
		            glyIcon: "remove",
		            btnStyle: "default",
		            btnSize: "sm",
		            handler: function() {
			            return me.cancelAction.apply( me, arguments );
		            }
		        } ]
		    } ];
	    },

	    onEditClick: function() {
		    var me = this;
		    me.showPopover();
	    },

	    getValue: function() {
		    var me = this, $popover = me._getPopoverEl(), $el = $( ".fb-ui-inplaceedit-field", $popover );

		    return $el.val();
	    },

	    setValue: function( value ) {
		    var me = this;
		    me.fieldItem.setValue( value );
	    }
	} );

} );

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class Input
 */
define( 'Firebrick.ui/fields/Input',[ "knockout", "text!./Base.html", "text!./Input.html", "./Base", "../common/mixins/Items", "./plugins/InplaceEdit" ], function( ko, tpl, subTpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Input", {
		extend: "Firebrick.ui.fields.Base",
		mixins: [ "Firebrick.ui.common.mixins.Items" ],
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.input",
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl: subTpl,
		/**
		 * @property type
		 * @type {String}
		 * @default "text"
		 */
		type: "text",
		/**
		 * @property label
		 * @type {String}
		 * @default ""
		 */
		label: "",
		/**
		 * @property containerCSS
		 * @type {String}
		 * @default ""
		 */
		containerCSS: "",
		/**
		 * @property value
		 * @type {String}
		 * @default null
		 */
		value: null,
		/**
		 * @property inplaceEditEmptyText
		 * @type {String}
		 * @default "empty"
		 */
		inplaceEditEmptyText: "empty",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @property formGroupClass
		 * @type {String}
		 * @default "form-group"
		 */
		formGroupClass: "form-group",
		/**
		 * show form-control class
		 * @property formControlClass
		 * @type {String}
		 * @default "form-control"
		 */
		formControlClass: "form-control",
		/**
		 * @property labelWidth
		 * @type {Int}
		 * @default 3
		 */
		labelWidth: 3,
		/**
		 * use grid system value
		 * @property inputWidth
		 * @type {Int}
		 * @default 9
		 */
		inputWidth: 9,
		/**
		 * screen reader only
		 * @property srOnly
		 * @type {Boolean}
		 * @default false
		 */
		srOnly: false,
		/**
		 * @property readOnly
		 * @type {Boolean}
		 * @default false
		 */
		readOnly: false,
		/**
		 * @property disabled
		 * @type {Boolean}
		 * @default false
		 */
		disabled: false,
		/**
		 * type of column size -md, sm, lg etc
		 * @property columnSize
		 * @type {Boolean|String} string (sm || lg)
		 * @default "sm"
		 */
		columnSize: "md",
		/**
		 * @property inputSize
		 * @type {Boolean|String} string (sm || lg)
		 * @default "sm"
		 */
		inputSize: "md",
		/**
		 * @property controlLabel
		 * @type {Boolean}
		 * @default true
		 */
		controlLabel: true,
		/**
		 * help text
		 * @property helpText
		 * @type {Boolean|String}
		 * @default false
		 */
		helpText: false,
		/**
		 * help text
		 * @property helpBlockClass
		 * @type {String}
		 * @default "help-block"
		 */
		helpBlockClass: "help-block",
		/**
		 * @property placeholder
		 * @type {String}
		 * @default ""
		 */
		placeholder: "",
		/**
		 * @property showStateIcon
		 * @type {Boolean}
		 * @default false
		 */
		showStateIcon: false,
		/**
		 * @property formControlFeedbackClass
		 * @type {String}
		 * @default "form-control-feedback"
		 */
		formControlFeedbackClass: "form-control-feedback",
		/**
		 * input addon
		 * @property inputAddon
		 * @type {Boolean|String} - string for inputAddon text - false to deactive, true to simply activate without text, true if you just want an icon (property: iconClass)
		 * @default false
		 */
		inputAddon: false,
		/**
		 * @property inputAddonClass
		 * @type {String}
		 * @default "input-group-addon"
		 */
		inputAddonClass: "input-group-addon",
		/**
		 * @property inputAddonSpanClass
		 * @type {String}
		 * @default ""
		 */
		inputAddonSpanClass: "",
		/**
		 * @property horizontal
		 * @type {Boolean}
		 * @default true
		 */
		horizontal: true,
		/**
		 * Feedback css bindings
		 * @property feedback_success
		 * @type {Boolean|String}
		 * @default false
		 */
		feedbackSuccess: false,
		/**
		 * Feedback css bindings
		 * @property feedback_warning
		 * @type {Boolean|String}
		 * @default false
		 */
		feedbackWarning: false,
		/**
		 * Feedback css bindings
		 * @property feedback_error
		 * @type {Boolean|String}
		 * @default false
		 */
		feedbackError: false,
		/**
		 * @property multiplesInline
		 * @type {Boolean|String}
		 * @default false
		 */
		multiplesInline: false,
		/**
		 * set as true to activate or object to activate and configure
		 * @property inplaceEdit
		 * @type {Boolean|Object}
		 * @default false
		 */
		inplaceEdit: false,
		/**
		 * @property showInplaceTitle
		 * @type {Boolean}
		 * @default true
		 */
		showInplaceTitle: true,
		/**
		 * adds html5 required attribute
		 * @property required
		 * @type {Boolean}
		 * @default false
		 */
		required: false,
		/**
		 * if none specified then the name is set to that of this.type
		 * @property name
		 * @type {String}
		 * @default ""
		 */
		name: "",
		/**
		 * @property inputAddonPosition
		 * @type {String}
		 * @default "left"
		 */
		inputAddonPosition: "left",
		/**
		 * @property _inputAddonTplId
		 * @private
		 * @type {String}
		 * @default null
		 */
		_inputAddonTplId: null,
		/**
		 * glyphicon to so in the inputAddon box
		 * @property iconClass
		 * @type {String|false}
		 * @default false
		 */
		iconClass: false,
		/**
		 * @property _lastValue
		 * @private
		 * @type {String}
		 * @default null
		 */
		_lastValue: null,
		/**
		 * if true - att "navbar-item" class to the button
		 * @property navbarItem
		 * @type {Boolean}
		 * @default false
		 */
		navbarItem: false,
		/**
		 * @method init
		 * @return .callParent(arguments)
		 */
		init: function() {
			var me = this;

				me.on( "rendered", function() {
					var inplaceConf;
					
					if ( me.inplaceEdit ) {
						inplaceConf = {
								fieldItem: me,
								showInplaceTitle: true
						};
						
						if ( $.isPlainObject( me.inplaceEdit ) ) {
							inplaceConf = Firebrick.utils.overwrite( inplaceConf, me.inplaceEdit );
						}
						
						Firebrick.create( "Firebrick.ui.fields.plugins.InplaceEdit", inplaceConf );
					}
					
					if ( me.required ) {
						me.onChange();
					}
				});

			return me.callParent( arguments );
		},
		
		/**
		 * this functions is called when the component is rendered and determines what to do when the component is changed
		 * @method onChange
		 */
		onChange: function() {
			var me = this,
				el = me.getElement(),
				container;

			if ( me.required ) {
				if ( el && el.length ) {
					el.change(function() {
						container = el.closest( ".form-group" );
						if ( container.length ) {
							
							if ( el.is( ":invalid" ) ) {
								me.setStatus( "error", container );
							} else {
								me.setStatus( "success", container );
							}
							
						}
						
					});
				}
			}
			
		},
		
		/**
		 * use this to set a particular BS3 has-* status - e.g "has-error"
		 * @method setStatus
		 * @param name {String} "error", "warning", "success"
		 * @param element {jQuery Object} [default=getElement()] - set if you wish to set the status to a different element - e.g. like the components parent
		 * @return self {Object}
		 */
		setStatus: function( status, element ) {
			var me = this,
				el = element || me.getElement();
			
			if ( el && el.length ) {
				
				if ( status ) {
					
					el.attr( "class", function( i, str ) {
						str = str.replace( /(^|\s)has-\S+/g, "" );	//replace all classes that start with "has-"
						str += " has-feedback";	//add the base class again (deleted by line above)
						return str;
					});
					
					el.addClass( "has-" + status );
					
				}
				
			}
			
			return me;
		},
		
		/**
		 * @method containerBindings
		 * @return {Object}
		 */
		containerBindings: function() {
			var me = this,
				obj = {
					css: {
						"'has-success'": me.feedbackSuccess,
						"'has-warning'": me.feedbackWarning,
						"'has-error'": me.feedbackError,
						"'has-feedback'": me.feedbackSuccess || me.feedbackWarning || me.feedbackError,
						"'sr-only'": me.srOnly
					}
				};
			
			if ( me.containerCSS ) {
				obj.css[ me.parseBind( me.containerCSS ) ] = true;
			}
			
			if ( me.align ) {
				obj.css[ me.parseBind( "pull-" + me.align ) ] = true;
			}
			
			if ( me.inputSize ) {
				obj.css[ me.parseBind( "form-group-" + me.inputSize ) ] = me.inputSize ? true : false;
			}
			
			if ( me.navbarItem ) {
				obj.css[ "'fb-ui-navbar-field'" ] = true;
			}
			
			return obj;
		},
		/**
		 * @method helpBlockBindings
		 * @return {Object}
		 */
		helpBlockBindings: function() {
			var me = this;
			return {
				text: me.textBind( "helpText" )
			};
		},
		/**
		 * @method feedbackBindings
		 * @return {Object}
		 */
		feedbackBindings: function() {
			var me = this,
				binds = { css: {} },
				rootClass = "'glyphicon-";
			if ( me.containerBindings && me.containerBindings.css ) {
				$.each( me.containerBindings.css, function( k,v ) {
					if ( v ) {
						switch ( k ){
							case "'has-success'":
								binds.css[ rootClass + "ok'" ] = v;
								break;
							case "'has-warning'":
								binds.css[ rootClass + "warning'" ] = v;
								break;
							case "'has-error'":
								binds.css[ rootClass + "remove'" ] = v;
								break;
						}
					}
				});
			}
			return binds;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				type =  me.parseBind( me.type ),
				obj = me.callParent( arguments );
			
			obj.attr.disabled = me.disabled;
			obj.attr.readonly = me.readOnly;
			if ( !me.inplaceEdit ) {
				obj.attr.type = type;
			}
			obj.attr.name = me.name ?  me.parseBind( me.name ) : type;
			
			obj.value = me.value;
			
			if ( me.inplaceEdit ) {
				
				obj.text = "Firebrick.getById('" + me.getId() + "')._getInplaceEditText( $data )";
				obj.css[ "'fb-ui-inplaceedit'" ] = true;

			} else {
				if ( me.formControlClass ) {
					obj.css[ me.parseBind( me.formControlClass ) ] = true;
				}
				obj.attr.placeholder = me.textBind( "placeholder" );
			}
			
			if ( me.required ) {
				obj.attr.required = true;
			}
			
			if ( me.inputSize ) {
				obj.css[ me.parseBind( "input-" + me.inputSize ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method inputAddonBindings
		 * @return {Object}
		 */
		inputAddonBindings: function() {
			var me = this,
				obj = {
					css: {}
				};
			if ( me.inputAddon ) {
				if ( $.isPlainObject( me.inputAddon ) ) {
					
					//button has been loaded
					if ( me.inputAddon.sName === "button.button" ) {
						//the addon is a button
						//remove if exists
						me.inputAddonClass = me.inputAddonClass.replace( "input-group-addon", "" );
						//add the correct class
						me.inputAddonClass += " input-group-btn";
					}
				}
				obj.css[ me.parseBind( me.inputAddonClass ) ] = true;
			}
			return obj;
		},
		/**
		 * @method inputAddonSpanBindings
		 * @return {Object}
		 */
		inputAddonSpanBindings: function() {
			var me = this,
				obj = { css: {} };
			
			if ( me.inputAddon && typeof me.inputAddon === "string" ) {
				obj.text = me.textBind( "inputAddon" );
			}
			
			obj.css[ me.parseBind( me.glyphiconClass ) ] = true;
			
			if ( me.iconClass ) {
				obj.css[ me.parseBind( me.iconClass ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method inputAddonTemplateBindings
		 * @return {Object}
		 */
		inputAddonTemplateBindings: function() {
			var me = this,
				obj = {
					template: me.parseBind( me.getAddonId() ),
					data: "$data"
				};
			return obj;
		},
		/**
		 *
		 * @method getAddonId
		 * @return {String} unique id
		 */
		getAddonId: function() {
			var me = this;
			
			if ( !me._inputAddonTplId ) {
				me._inputAddonTplId = "fb-inputaddon-" + Firebrick.utils.uniqId();
			}
			
			return me._inputAddonTplId;
		},
		/**
		 * @method labelBindings
		 * @return {Object}
		 */
		labelBindings: function() {
			var me = this,
				obj = {
					text: me.textBind( "label" ),
					css: {
						"'control-label'": me.controlLabel
					}
				};
			if ( me.horizontal ) {
				obj.css[ me.parseBind( "col-" + me.columnSize + "-" + me.labelWidth ) ] = me.horizontal;
			}
			return obj;
		},
		/**
		 * @method inputContainerBindings
		 * @return {Object}
		 */
		inputContainerBindings: function() {
			var me = this,
				obj = {
					css: {}
				};
			if ( me.horizontal ) {
				obj.css[ me.parseBind( "col-" + me.columnSize + "-" + me.inputWidth ) ] = me.horizontal;
			}

			return obj;
		},
		/**
		 * @method fieldBindings
		 * @return {Object}
		 */
		fieldBindings: function() {
			var me = this,
				obj = {
					css: {
						"'input-group'": me.inputAddon ? true : false
					}
				};
			
			if ( me.align ) {
				obj.css[ me.parseBind( "pull-" + me.align ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method getValue
		 * @return {Any}
		 */
		getValue: function() {
			var me = this;
			return me.getElement().val();
		},
		/**
		 * @method setValue
		 * @event changed
		 * @return self
		 */
		setValue: function( value ) {
			var me = this,
				oldValue = me.getValue(),
				newValue;

			me._lastValue = oldValue;
			me._setValue( value );
			
			newValue = me.getValue();
			
			me._checkChange( newValue, oldValue );
			
			return me;
		},
		/**
		 * @event changed( newValue, oldValue )
		 * @method _checkChange
		 * @private
		 * @param newVal {Any}
		 * @param oldVal {Any}
		 * @param silent {Boolean} default=false
		 * @return {Boolean}
		 */
		_checkChange: function( newVal, oldVal, silent ) {
			var me = this;
			
			if ( me._hasChange( newVal, oldVal ) ) {
				if ( !silent ) {
					me.fireEvent( "changed", newVal, oldVal );
				}
				return true;
			}
			
			return false;
		},
		/**
		 * @method _hasChange
		 * @private
		 * @param newVal {Any}
		 * @param oldVal {Any}
		 */
		_hasChange: function( newVal, oldVal ) {
			return newVal !== oldVal;
		},
		/**
		 * @method _setValue
		 * @param value
		 * @private
		 */
		_setValue: function( value ) {
			var me = this,
				$el = me.getElement();
			
			$el.val( value );
			
			if ( me.inplaceEdit ) {
				me._setValueInplaceEdit( value );
			}
			
			return me;
		},
		/**
		 * @method _setValueInplaceEdit
		 * @param value
		 * @private
		 */
		_setValueInplaceEdit: function() {
			var me = this,
				$el = me.getElement();
			$el.text( me._getInplaceEditText( Firebrick.utils.dataFor( $el[ 0 ] ) ) );
			$el.trigger( "change" );
			return me;
		},
		/**
		 * @method _getInplaceEditText
		 * @private
		 * @param $data {KO Object}
		 * @return {String}
		 */
		_getInplaceEditText: function( $data ) {
			var me = this,
				$el = me.getElement(),
				value = $el ? me.getValue() : me.value,
				text = "";
				
			if ( value ) {
				if ( $data.hasOwnProperty( value ) ) {
					text = ko.unwrap( $data[ value ] );
				} else {
					text = value;
				}
			} else {
				text = Firebrick.text( me.inplaceEditEmptyText );
			}
				
			return text;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * Base for inputs where multiple options are possible: checkboxes, radio and togglesbuttons for example
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.common
 * @class MultiplesBase
 */
define( 'Firebrick.ui/common/MultiplesBase',[ "knockout-mapping", "../fields/Input" ], function( kom ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.common.MultiplesBase", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @method fieldBindings
		 * @return {Object}
		 */
		fieldBindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			if ( !me.inplaceEdit ) {
				
				obj.withProperties = {
							itemId: "'fb-ui-id-' + Firebrick.utils.uniqId()"
						};

				if ( me.multiplesInline ) {
					
					if ( !obj.css ) {
						obj.css = {};
					}
					
					obj.css[ me.parseBind( me.cleanString( me.type ) + "-inline" ) ] = me.multiplesInline;
				}
			}
			
			return obj;
		},
		
		/**
		 * used to check which item should be selected by default
		 * @method _valueChecker
		 * @private
		 * @param $default {Any} optional
		 * @param $data {Any} value of iteration item
		 * @default {Boolean}
		 */
		_valueChecker: function( $default, $data ) {
			var me = this;
			
			if ( kom.isMapped( $data ) ) {
				$data = kom.toJS( $data );
			}
			
			if ( $.isPlainObject( $data ) ) {
				if ( $data.active ) {
					//active property wins
					return $.isFunction( $data.active ) ? $data.active() : $data.active;
				} else if ( $data.checked ) {
					return $.isFunction( $data.checked ) ? $data.checked() : $data.checked;
				} else if ( $data.value ) {
					//get the value prop
					$data = $data.value;
				}
			}

			//something to compare too
			if ( $default ) {
				//ko function?
				if ( $.isFunction( $default ) ) {
					$default = $default();
				}
				//compare
				return $default === $data;
			}
						
			//just return default
			return me.defaultActive;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.MultiplesBase
 * @namespace components.button
 * @class ToggleButton
 */
define( 'Firebrick.ui/button/ToggleButton',[ "text!./ToggleButton.html", "knockout", "jquery", "../common/MultiplesBase" ], function( subTpl, ko, $ ) {
	"use strict";
	
	if ( !ko.bindingHandlers.toggleRenderer ) {
		/*
		 * optionsRenderer for togglebuttons
		 * create dynamic css along with static
		 */
		ko.bindingHandlers.toggleRenderer = {
		    init: function( element, valueAccessor, allBindings, viewModel ) {
				var me = Firebrick.ui.getCmp( valueAccessor() ),
					currentStyle = "btn-" + me.btnStyle,
					$el = $( element ),
					inputId = allBindings().withProperties.inputItemId;

				//ko data bound observable
				inputId = Firebrick.ui.utils.getValue( inputId );
				
				if ( $el.length ) {
					if ( viewModel ) {
						if ( viewModel.btnStyle ) {
							//replace element className with the new one defined in the binding
							$el.attr( "class", function( i, v ) {
								return v.replace( currentStyle, "btn-" + Firebrick.ui.utils.getValue( viewModel.btnStyle ) );
							});
						}
						if ( viewModel.css ) {
							$el.addClass( Firebrick.ui.utils.getValue( viewModel.css ) );
						}
					}
					//add the correct "for" attribute id and the input id
					$el.attr( "for", inputId );
					$( "> input", $el ).attr( "id", inputId );
				}
				
		    }
		};
	}
	
	return Firebrick.define( "Firebrick.ui.button.ToggleButton", {
		extend: "Firebrick.ui.common.MultiplesBase",
		/**
		 * component alias
		 * @property sName
		 * @type {String}
		 */
		sName: "button.togglebutton",
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl: subTpl,
		/**
		 * @property btnGroupClass
		 * @type {Boolean|String}
		 * @default true
		 */
		btnGroupClass: true,
		/**
		 * @property btnClass
		 * @type {Boolean|String}
		 * @default true
		 */
		btnClass: true,
		/**
		 * @property defaultActive
		 * @type {Boolean|String}
		 * @default false
		 */
		defaultActive: false,
		/**
		 * @property dataToggle
		 * @type {Boolean|String}
		 * @default "buttons"
		 */
		dataToggle: "buttons",
		/**
		 * default, primary, success, danger, warning, info
		 * @property btnStyle
		 * @type {String|false}
		 * @default "primary"
		 */
		btnStyle: "default",
		/**
		 * lg,md,xs,sm
		 * @property btnSize
		 * @type {String|false}
		 * @default "md"
		 */
		btnSize: "md",
		/**
		 * options that are to be shown by the toggle button : [{text:"abc", active:true, config:{btnStyle:"success"}, "b", "c", "d"]
		 * @property options
		 * @type {String|Array of Objects}
		 * @default "''"
		 */
		options: "''",
		/**
		 * @property showLabel
		 * @type {Boolean}
		 * @default true
		 */
		showLabel: true,
		/**
		 * @property optionsRenderer
		 * @type {String}
		 * @default "optionsRenderer"
		 */
		optionsRenderer: "optionsRenderer",
		/**
		 * @method btnGroupBindings
		 * @return {Object}
		 */
		btnGroupBindings: function() {
			var me = this;
			return {
				css: {
					"'btn-group'": me.btnGroupClass
				},
				attr: {
					"'data-toggle'": me.parseBind( me.dataToggle )
				},
				foreach: Firebrick.ui.helper.optionString( me )
			};
		},
		/**
		 * @method toggleInputBindings
		 * @return {Object}
		 */
		toggleInputBindings: function() {
			var me = this;
			return {
				attr: {
					//id attribute is parsed by the toggleRenderer
					name: me.parseBind( me.name )
				},
				value: "$data.value || $data.text ? $data.value || $data.text : $data"
			};
		},
		
		/**
		 * @method toggleLabelBindings
		 * @return {Object}
		 */
		toggleLabelBindings: function() {
			var me = this,
				obj = {
					attr: {
						id: "$data.labelId || 'fb-ui-id-' + Firebrick.utils.uniqId()"
					},
					withProperties: {
						inputItemId: "$data.id || 'fb-ui-id-' + Firebrick.utils.uniqId()"
					},
					css: {
						active: "Firebrick.ui.getCmp('" + me.getId() + "')._valueChecker(" + me.value + ", $data)"
					},
					toggleRenderer: me.parseBind( me.getId() )
				};

			if ( me.btnClass ) {
				obj.css.btn = true;
			}
			
			if ( me.btnStyle ) {
				obj.css[ me.parseBind( "btn-" + me.btnStyle ) ] = true;
			}
			
			if ( me.btnSize ) {
				obj.css[ me.parseBind( "btn-" + me.btnSize ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method toggleLabelTextBindings
		 * @return {Object}
		 */
		toggleLabelTextBindings: function() {
			return {
				"text": "$data.text ? $data.text : $data"
			};
		}
	});
});


define('text!Firebrick.ui/common/mixins/tpl/Label.html',[],function () { return '{{?it.labelText}}\r\n<span data-bind="{{=it.dataBind(\'labelBindings\')}}"></span>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Label
 * @static
 */
define( 'Firebrick.ui/common/mixins/Label',[ "text!./tpl/Label.html" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.common.mixins.Label", {
		/**
		 * @property labelTpl
		 * @type {String} html
		 * @default Label.html
		 */
		labelTpl: tpl,
		/**
		 * add Label css classes
		 * @property labelCSS
		 * @type {String}
		 * @default ""
		 */
		labelCSS: "",
		/**
		 * @property labelText
		 * @type {String}
		 * @default ""
		 */
		labelText: "",
		/**
		 * @method getLabelTpl
		 */
		getLabelTpl: function() {
			var me = this;
			me.template( "labelTpl" );
			return me.build( "labelTpl" );
		},
		/**
		 * string = "default", "primary", "success" "info", "warning", "danger"
		 * @property labelStyle
		 * @type {Boolean|String}
		 * @default "default"
		 */
		labelStyle: "default",
		/**
		 * @method labelBindings
		 * @return Object
		 */
		labelBindings: function() {
			var me = this,
				obj = {
						text: me.textBind( "labelText" ),
						css: {
							label: true
						}
					};
			
				if ( me.labelStyle ) {
					obj.css[ me.parseBind( "label-" + me.labelStyle ) ] = true;
				}
				
			if ( me.labelCSS ) {
				obj.css[ me.parseBind( me.labelCSS ) ] = true;
			}
				
			return obj;
		}
	});
});


define('text!Firebrick.ui/nav/Navbar.html',[],function () { return '<nav id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t<div data-bind="{{=it.dataBind(\'navbarWrapperBindings\')}}">\r\n\t\t{{?it.showNavbarHeader}}\r\n\t\t<div data-bind="{{=it.dataBind(\'navbarHeaderBindings\')}}">\r\n\t\t\t{{?it.toggleButton}}\r\n\t\t\t\t<button data-bind="{{=it.dataBind(\'toggleButtonBindings\')}}">\r\n\t\t         \t<span class="sr-only" data-bind="{{=it.dataBind(\'toggleTextBindings\')}}"></span>\r\n\t\t         \t<span class="icon-bar"></span>\r\n\t\t         \t<span class="icon-bar"></span>\r\n\t\t         \t<span class="icon-bar"></span>\r\n\t       \t\t</button>\r\n       \t\t{{?}}\r\n       \t\t{{?it.showBranding}}\r\n      \t\t\t<a data-bind="{{=it.dataBind(\'brandBindings\')}}">{{=it.brandTpl}}</a>\r\n      \t\t{{?}}\r\n\t\t</div>\r\n\t\t{{?}}\r\n\t\t<div data-bind="{{=it.dataBind(\'navbarContainerBindings\')}}">\r\n     \t\t{{=it.getItems()}}\r\n     \t</div>\r\n\t</div>\r\n</nav>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.nav
 * @uses components.common.mixins.Items
 * @class Base
 */
define( 'Firebrick.ui/nav/Base',[ "../common/Base", "../common/mixins/Items" ], function() {
	
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.nav.Base", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Items"
	});
	
});


define('text!Firebrick.ui/display/List.html',[],function () { return '<!-- ko {{=it.dataBind(\'listTemplateBindings\')}} --><!-- /ko -->\r\n\r\n<script type="text/html" id="{{=it._getTplId()}}">\r\n\t<!-- ko {{=it.dataBind(\'virtualContainerBindings\')}} -->\r\n\t\t<{{=it.listType}} data-bind="{{=it.dataBind()}}">\r\n\t\t\t<li data-bind="{{=it.dataBind(\'listItemBindings\')}}">\r\n\t\t\t\t{{?it._preNode}}\r\n\t\t\t\t<span data-bind="{{=it.dataBind(\'listItemNodeBindings\')}}"></span>\r\n\t\t\t\t{{?}}\r\n\t\t\t\t{{=it.b(it.preItemTpl)}}\r\n\t\t\t\t\t{{?it.linkedList}}\r\n\t\t\t\t\t\t<a data-bind="{{=it.dataBind(\'listLinkBindings\')}}">\r\n\t\t\t\t\t{{?}}\r\n\t\t\t\t\t\t\t<span data-bind="{{=it.dataBind(\'listItemTextBindings\')}}"></span>\r\n\t\r\n\t\t\t\t\t\t\t{{?it.badge}}\r\n\t\t\t\t\t\t\t\t<span data-bind="{{=it.dataBind(\'badgeBindings\')}}"></span>\r\n\t\t\t\t\t\t\t{{?}}\r\n\r\n\t\t\t\t\t{{?it.linkedList}}\r\n\t\t\t\t\t\t</a>\r\n\t\t\t\t\t{{?}}\r\n\t\t\t\t{{=it.b(it.postItemTpl)}}\r\n\t\t\t\t<!-- ko {{=it.dataBind(\'childrenBindings\')}} --><!-- /ko -->\r\n\t\t\t</li>\r\n\t\t</{{=it.listType}}>\r\n\t<!-- /ko -->\r\n</script>\r\n';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class List
 */
define( 'Firebrick.ui/display/List',[ "text!./List.html", "knockout", "jquery", "../common/Base",  "../common/mixins/Items", "../common/mixins/Badges" ], function( tpl, ko, $ ) {
	"use strict";
	
	if ( !ko.bindingHandlers.listRenderer ) {
		/*
		 * optionsRenderer for list
		 * create dynamic css along with static
		 */
		ko.virtualElements.allowedBindings.listRenderer = true;
		ko.bindingHandlers.listRenderer = {
			init: function( element, valueAccessor ) {
				var childNodes = ko.virtualElements.childNodes( element ),
					node;

				for ( var i = 0, l = childNodes.length; i < l; i++ ) {
					node = childNodes[ i ];
					if ( node instanceof window.HTMLUListElement ) {
						//list item
						$( node ).attr( "id", valueAccessor() );
					}
				}
			}
		};
	}
	
	if ( !ko.bindingHandlers.listItemRenderer ) {
		ko.virtualElements.allowedBindings.listItemRenderer = true;
		ko.bindingHandlers.listItemRenderer = {
		    init: function( element, valueAccessor, allBindings, viewModel ) {
				var $el = $( element );
	
				if ( $el.length ) {
					if ( viewModel ) {
						if ( viewModel.css ) {
							$el.addClass( Firebrick.ui.utils.getValue( viewModel.css ) );
						}
					}
				}
		    }
		};
	}
	
	return Firebrick.define( "Firebrick.ui.display.List", {
		extend: "Firebrick.ui.common.Base",
		mixins: [ "Firebrick.ui.common.mixins.Items", "Firebrick.ui.common.mixins.Badges" ],
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-list"
		 */
		sName: "display.list",
		/**
		 * @property tpl
		 * @type {String} html
		 * @default components/display/List.html
		 */
		tpl: tpl,
		/**
		 * type of list, ul or ol
		 * @property listType
		 * @type {String}
		 * @default "ul"
		 */
		listType: "ul",
		/**
		 * is a list group?
		 * @property listGroup
		 * @type {Boolean|String}
		 * @default true
		 */
		listGroup: false,
		/**
		 * defaults to true but only comes into effect with property "listGroup"
		 * @property listItemGroupClass
		 * @type {Boolean|String}
		 * @default true
		 */
		listItemGroupClass: true,
		/**
		 * items to parse into the list
		 * @property data
		 * @type {String}
		 * @default null
		 */
		data: null,
		/**
		 * unstyled - applies list-unstyled css class to list container (ul/ol)
		 * @property unstyled
		 * @type {boolean}
		 * @default false
		 */
		unstyled: false,
		/**
		 * inject a template into the <li>{preItemTpl}<span></span>{postItemTpl}</li> item
		 * @property preItemTpl
		 * @type {String|Function} html
		 * @default ""
		 */
		preItemTpl: "",
		/**
		 * inject a template into the <li>{preItemTpl}<span></span>{postItemTpl}</li> item
		 * @property postItemTpl
		 * @type {String|Function} html
		 * @default ""
		 */
		postItemTpl: "",
		/**
		 * wrap the list element content in a <a></a> link
		 * @property linkedList
		 * @type {Boolean}
		 * @default false
		 */
		linkedList: false,
		/**
		 * @method virtualContainerBindings
		 * @return {Object}
		 */
		virtualContainerBindings: function() {
			return { "if": "$data && $data.length" };
		},
		/**
		 * set to true to add attribute [fb-ignore-router=true] to all links - these links are then ignored by the history api (Firebrick.router.history)
		 * @property ignoreRouter
		 * @type {Boolean}
		 * @default false
		 */
		ignoreRouter: false,
		/**
		 * @property collapsedCSS
		 * @type {String}
		 * @default "fb-ui-listitem-collapsed"
		 */
		collapsedCSS: "fb-ui-listitem-collapsed",
		/**
		 * set to false to remove node span before text
		 * @property preNode
		 * @type {Boolean}
		 * @default true
		 */
		preNode: true,
		/**
		 * @method nodeCSSRenderer
		 * @param $data {ko bindings context}
		 * @return {Object} passed to $element.addClass()
		 */
		nodeCSSRenderer: function( $data ) {
			var obj = {},
				children = $data.children;
			
			obj[ "fb-ui-node-action" ] = true;
			
			if ( children ) {
				
				obj.glyphicon = true;
				
				if ( children.expandable !== false ) {
					obj[ "fb-ui-list-expandable-node" ] = true;
				}
				
			} else {
				obj[ "fb-ui-hidden" ] = true;
			}
			
			return obj;
		},
		/**
		 * @method init
		 */
		init: function() {
			var me = this;
			
			me.on( "rendered", function() {
				me._initUIEvents();
			});
			
			return me.callParent( arguments );
		},
		/**
		 * @method _initUIEvents
		 * @private
		 */
		_initUIEvents: function() {
			var me = this,
				$el = me.getElement(),
				$collapsibles = $( ".fb-ui-list-expandable-node", $el ),
				func = function() {
					return me._nodeClick( this, arguments );
				};

			if ( $collapsibles.length ) {
				$collapsibles.on( "click", func );
				me.on( "destroy", function() {
					$collapsibles.off( "click", func );
				});
			}
		},
		/**
		 * @method _nodeClick
		 * @private
		 * used by jQuery on click event
		 */
		_nodeClick: function( element, clickArgs ) {
			var me = this,
				$el = $( element ),
				$node = $el.closest( "li.fb-ui-listitem-parent" ),
				args = Firebrick.utils.argsToArray( clickArgs );
			
			args.unshift( "nodeClicked" );	//add to the begining
			args.push( $node ); //add to end
			
			me.toggleCollapse( $node );
			
			return me.fireEvent( "nodeClicked", args );
		},
		/**
		 * @method toggleCollapse
		 * @param $node {jQuery Object} li node item
		 */
		toggleCollapse: function( $node ) {
			var me = this,
				$ul = $( "> ul", $node );
			
			if ( $ul.length ) {
				if ( $ul.is( ":visible" ) ) {
					me.collapseNode( $node );
				} else {
					me.expandNode( $node );
				}
			}
		},
		/**
		 * @method collapseNode
		 * @param $node {jQuery Object} li node item
		 */
		collapseNode: function( $node ) {
			var me = this,
				$ul = $( "> ul", $node );
			
			if ( $ul.length ) {
				$ul.hide();
				me.fireEvent( "nodeCollapsed", $node, $ul );
				$node.addClass( me.collapsedCSS );
			}
		},
		/**
		 * @method expandNode
		 * @param $node {jQuery Object} li node item
		 */
		expandNode: function( $node ) {
			var me = this,
				$ul = $( "> ul", $node );
			
			if ( $ul.length ) {
				$ul.show();
				me.fireEvent( "nodeExpanded", $node, $ul );
				$node.removeClass( me.collapsedCSS );
			}
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );

			if ( me.listGroup ) {
				obj.css[ "'list-group'" ] = me.listGroup;
			}
			if ( me.unstyled ) {
				obj.css[ "'fb-ui-list-unstyled'" ] = me.unstyled;
			}
			if ( me.items ) {
				obj.foreach = "$data";
			}
			
			obj.visible = "$parent.expanded === false ? false : true";
			
			return obj;
		},
		/**
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function() {
			var me  = this,
				obj = {
					css: {
						"'fb-ui-listitem-parent'": "$data.children ? true : false",
						"'fb-ui-listitem-haschildren'": "$data.children ? true : false"
					},
					attr: {}
				};
			
			if ( me.listGroup && me.listItemGroupClass ) {
				obj.css[ "'list-group-item'" ] = me.listItemGroupClass;
			}
			
			obj.css[ me.parseBind( me.collapsedCSS ) ] = "$data.children && $data.expandable !== false && $data.expanded === false ? true : false";
			
			obj.css.divider = "$data === '|' || $data.divider ? true : false";
			obj.attr.id = "$data.id || 'fb-ui-listitem-' + Firebrick.utils.uniqId()";
			obj.listItemRenderer = true;
			
			return obj;
		},
		/**
		 * @method listItemTextBindings
		 * @return {Object}
		 */
		listItemTextBindings: function() {
			return {
				value: "$data.hasOwnProperty('value') ? $data.value : $data",
				htmlWithBinding: "$data.renderer ? $data.renderer($data, $context) : ($data.text ? $data.text : $data)",
				css: {
					"'fb-ui-listitem-text'": true
				}
			};
		},
		/**
		 * @method listTemplateBindings
		 * @return {Object}
		 */
		listTemplateBindings: function() {
			var me = this;
			return {
				template: {
					name:  me.parseBind( me._getTplId() ),
					data: $.isArray( me.items ) ? "Firebrick.ui.getCmp('" + me.getId() + "').items" : me.items
				},
				listRenderer: me.parseBind( me.getId() )
			};
		},
		/**
		 * @private
		 * @method _getTplId
		 * @return {String}
		 */
		_getTplId: function() {
			return "fb-ui-tpl-" + this.getId();
		},
		/**
		 * @method childrenBindings
		 * @return {Object}
		 */
		childrenBindings: function() {
			var me = this;
			return {
				template: {
					name:  me.parseBind( me._getTplId() ),
					data: "$data.children"
				}
			};
		},
		/**
		 * @method listLinkBindings
		 * @return {Object}
		 */
		listLinkBindings: function() {
			var me = this,
				obj = {
					attr: {
						href: "Firebrick.ui.helper.linkBuilder( $data )",
						"'data-value'": "$data.hasOwnProperty('value') ? $data.value : $data"
					},
					value: "$data.hasOwnProperty('value') ? $data.value : $data"
			};
			obj.attr[ "'data-target'" ] = "$data.dataTarget ? $data.dataTarget : false";
			obj.attr[ "'fb-ignore-router'" ] = "$data.hasOwnProperty( 'ignoreRouter' ) ? $data.ignoreRouter : " + me.ignoreRouter;
			return obj;
		},
		/**
		 * @method listItemNodeBindings
		 * @return {Object}
		 */
		listItemNodeBindings: function() {
			var me = this,
				obj = {
					css: "Firebrick.getById('" + me.getId() + "').nodeCSSRenderer( $data )"
				};
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class List
 */
define( 'Firebrick.ui/nav/List',[ "../display/List" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.nav.List", {
		extend: "Firebrick.ui.display.List",
		sName: "nav.list",
		unstyled: true,
		linkedList: true,
		/**
		 * whether navbar-nav class is applied to list
		 * @property navbarNavClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarNavClass: true,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( me.navbarNavClass ) {
				obj.css[ "'navbar-nav'" ] = true;
			}

			obj.css.nav = true;
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.nav.Base
 * @namespace components.nav
 * @class Navbar
 */
define( 'Firebrick.ui/nav/Navbar',[ "text!./Navbar.html", "./Base", "./List" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.nav.Navbar", {
		extend: "Firebrick.ui.nav.Base",
		tpl: tpl,
		sName: "nav.navbar",
		/**
		 * passed on to the toolbar items (direct children only)
		 * @property toolbarDefaults
		 * @type {Object}
		 * @default {Object} {
		 * 		navbarItem: true
		 * }
		 */
		defaults: {
			navbarItem: true
		},
		/**
		 * false to deactivate
		 * @property navTypeClass
		 * @type {Boolean|String} string: navbar-fixed-top, navbar-static-top, navbar-fixed-top, navbar-fixed-bottom, navbar-inverse (navbarDefaultClass=false)
		 * @default "'navbar-static-top'"
		 */
		navTypeClass: "navbar-static-top",
		/**
		 * whether "navbar-default" is used
		 * @property navbarDefaultClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarDefaultClass: true,
		/**
		 * whether "navbar" css class is used
		 * @property navbarClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarClass: true,
		/**
		 * whether "navbar-form" css class is used
		 * @property navbarFormClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarFormClass: true,
		/**
		 * css class: navbar-header
		 * @property navbarHeaderClass
		 * @type {Boolean}
		 * @default true
		 */
		navbarHeaderClass: true,
		/**
		 * if false then the navigation won't collapse to the small menu button
		 * @property toggleButton
		 * @type {Boolean}
		 * @default true
		 */
		toggleButton: true,
		/**
		 * @property toggleText
		 * @type {String}
		 * @default "Toggle navigation"
		 */
		toggleText: "Toggle navigation",
		/**
		 * @property brandClass
		 * @type {Boolean|String}
		 * @default true
		 */
		brandClass: true,
		/**
		 * false to deactivate
		 * @property brandLink
		 * @type {Boolean|String}
		 * @default "/"
		 */
		brandLink: "/",
		/**
		 * brand text - false to show none or if you wish to use brandTpl instead
		 * @property brandText
		 * @type {Boolean|String}
		 * @default "Firebrick.ui"
		 */
		brandText: "Firebrick.ui",
		/**
		 * false to deactivate
		 * @property brandTpl
		 * @type {Boolean|String}
		 * @default false
		 */
		brandTpl: false,
		/**
		 * data to populate navigation with
		 * @property data
		 * @type {String}
		 * @default null
		 */
		data: null,
		/**
		 * overriding parent
		 * @property listGroupClass
		 * @default false
		 */
		listGroupClass: false,
		/**
		 * sets nav && nav-bar css classes to the list container
		 * @property navClass
		 * @type {String|Boolean}
		 * @default true
		 */
		navClass: true,
		/**
		 * @property showNavbarHeader
		 * @type {Boolean}
		 * @default true
		 */
		showNavbarHeader: true,
		/**
		 * @property showBranding
		 * @type {Boolean}
		 * @default true
		 */
		showBranding: true,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
		
			obj.attr.role = "'navigation'";
			obj.css[ "'navbar-default'" ] = me.navbarDefaultClass;
			obj.css.navbar = me.navbarClass;
			
			if ( me.navTypeClass ) {
				obj.css[ me.parseBind( me.navTypeClass ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method brandBindings
		 * @return {Object}
		 */
		brandBindings: function() {
			var me = this,
				obj = {
					css: {},
					attr: {}
				};
			
			if ( me.brandLink !== false ) {
				obj.attr.href =  me.parseBind( me.brandLink );
			}
			
			if ( me.brandClass ) {
				obj.css[ "'navbar-brand'" ] = me.brandClass;
			}
			if ( me.brandText && !me.brandTpl ) {
				obj.text = me.parseBind( me.brandText );
			}
			return obj;
		},
		/**
		 * overriding parent
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function() {
			return {
					css: {
						active: "$data.active ? $data.active : false"
					}
				};
		},
		/**
		 * @method navbarHeaderBindings
		 * @return {Object}
		 */
		navbarHeaderBindings: function() {
			var me = this,
				obj = { css: {} };
			if ( me.navbarHeaderClass ) {
				obj.css[ "'navbar-header'" ] = me.navbarHeaderClass;
			}
			return obj;
		},
		/**
		 * @method navbarContainerBindings
		 * @return {Object}
		 */
		navbarContainerBindings: function() {
			var me = this,
				obj = {
						attr: {
							id:  me.parseBind( "fb-nav-" + me.getId() )
						},
						css: {}
					};
			if ( me.toggleButton ) {
				obj.css.collapse = true;
				obj.css[ "'navbar-collapse'" ] = true;
			}
			
			if ( me.navbarFormClass ) {
				obj.css[ "'navbar-form'" ] = true;
			}
			
			return obj;
		},
		/**
		 * @method toggleTextBindings
		 * @return {Object}
		 */
		toggleTextBindings: function() {
			var me = this;
			return {
				text: me.textBind( "toggleText" )
			};
		},
		/**
		 * @method toggleButtonBindings
		 * @return {Object}
		 */
		toggleButtonBindings: function() {
			var me = this,
				id = "fb-nav-" + me.getId() + "'",
				obj = {
					attr: {
						type: "'button'",
						"'data-toggle'": "'collapse'",
						"'data-target'": "'#" + id,
						"'aria-expanded'": false,
						"'aria-controls'": "'" + id
					},
					css: {
						collapsed: true,
						"'navbar-toggle'": true
					}
				};
			
			return obj;
		},
		/**
		 * @method navbarWrapperBindings
		 * @return {Object}
		 */
		navbarWrapperBindings: function() {
			return {
				css: {
					"container": true
				}
			};
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.nav.Navbar
 * @namespace components.nav
 * @class Toolbar
 */
define( 'Firebrick.ui/nav/Toolbar',[ "./Navbar" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.nav.Toolbar", {
		extend: "Firebrick.ui.nav.Navbar",
		sName: "nav.toolbar",
		showBranding: false,
		/**
		 * possible positions: top, bottom
		 * @property position
		 * @type {String}
		 * @default "top"
		 */
		position: "top",
		init: function() {
			var me = this;
			
			me.navTypeClass = "navbar-fixed-" + me.position;
			
			return me.callParent( arguments );
		},
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'fb-ui-toolbar'" ] = true;
			
			return obj;
		},
		navbarContainerBindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'navbar-nav'" ] = false;
			obj.css[ "'fb-ui-navbar'" ] = true;
			obj.css[ "'form-horizontal'" ] = true;
			
			return obj;
		},
		/**
		 * @method navbarWrapperBindings
		 * @return {Object}
		 */
		navbarWrapperBindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( obj.css.container ) {
				delete obj.css.container;
			}
			
			obj.css[ "'container-fluid'" ] = true;
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Toolbars
 * @static
 */
define( 'Firebrick.ui/common/mixins/Toolbars',[ "jquery", "./Items", "Firebrick.ui/nav/Toolbar" ], function( $ ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.common.mixins.Toolbars", {
		/**
		 * passed on to the toolbar items (direct children only)
		 * @property _toolbarDefaults
		 * @private
		 * @type {Object}
		 * @default {Object} {
		 * 		navbarItem: true
		 * }
		 */
		_toolbarDefaults: {
			navbarItem: true
		},
		/**
		 * use this to provide the given panel with toolbars
		 * @example
		 * 	toolbar:[{
		 * 		position: "top",
		 * 		items: [{...}]
		 * 	}]
		 * @example
		 * 	toolbar:[{
		 * 		position: "top",
		 * 		items: [{...}]
		 * 	},{
		 * 		position: "bottom",
		 * 		items: [{...}]
		 * 	}]
		 * @property toolbars
		 * @type {Array of Objects}
		 * @default null
		 */
		toolbars: null,
		/**
		 * add css classes and other configuration to the container
		 * @method toolbarContainer
		 * @param obj {Object} obj that is later pass to the binder
		 * @return {Object}
		 */
		toolbarContainer: function( obj ) {
			var me = this,
				toolbarPosition;
			
			if ( me.toolbars && $.isArray( me.toolbars ) ) {
				
				obj.css[ "'fb-ui-toolbar-container'" ] = true;
				
				for ( var i = 0, l = me.toolbars.length; i < l; i++ ) {
					toolbarPosition = me.toolbars[ i ].position;
					if ( toolbarPosition ) {
						obj.css[ me.parseBind( "fb-ui-toolbar-" + toolbarPosition ) ] = true;
					}
				}
			}
			return obj;
		},
		
		/**
		 * @method getToolbars
		 * @return {html}
		 */
		getToolbars: function() {
			var me = this,
				toolbars = me.toolbars,
				tbItem,
				html = "",
				items;
			
			if ( toolbars ) {
				if ( $.isArray( toolbars ) ) {
					for ( var i = 0, l = toolbars.length; i < l; i++ ) {
						tbItem = toolbars[ i ];
						if ( tbItem.items ) {
							//wrap the items inside a toolbar component
							tbItem.sName = "nav.toolbar";
							tbItem.defaults = Firebrick.utils.overwrite( me._toolbarDefaults, ( tbItem.defaults || {}) );
							items = me._getItems( tbItem );
							//load the html for the template compiler
							html += items.html;
							me.toolbars[ i ] = items.items[ 0 ];
						} else {
							console.warn( "a toolbar was found without the items property and didn't render" );
						}
					}
				} else {
					console.warn( "unable to load toolbars for this panel", me, "toolbars property must be an array of objects" );
				}
			}
			
			return html;
		}
	});
});


define('text!Firebrick.ui/containers/Accordion.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{=it.getItems()}}\r\n</div>';});


define('text!Firebrick.ui/containers/Panel.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{?it.title !== false || it.collapsible || it.headerItems}}\r\n\t<div data-bind="{{=it.dataBind(\'panelHeaderBindings\')}}">\r\n\t\t{{?it.title !== false}}\r\n\t\t\t{{?it.title}}\r\n\t\t{{?}}\r\n\t\t\t{{?it.collapsible}}\r\n\t\t\t\t<a data-bind="{{=it.dataBind(\'collapsibleLinkBindings\')}}">\r\n\t\t\t{{?}}\r\n\t\t\t\t<h{{=it.headerSize}} data-bind="{{=it.dataBind(\'panelHeaderTextBindings\')}}"></h{{=it.headerSize}}>\t\r\n\t\t\t\t{{=it.getLabelTpl()}}\r\n\t\t\t{{?it.collapsible}}\r\n\t\t\t\t</a>\r\n\t\t\t{{?}}\r\n\t\t{{?}}\r\n\t\t{{=it.getDefaultIcons()}}\r\n\t\t{{?it.headerItems}}\r\n\t\t\t<div data-bind="{{=it.dataBind(\'headerItemsBindings\')}}">\r\n\t\t\t\t{{=it.getItemsProp(\'headerItems\')}}\r\n\t\t\t</div>\r\n\t\t{{?}}\r\n\t</div>\r\n\t{{?}}\r\n\t\t<div data-bind="{{=it.dataBind(\'tabBindings\')}}">\r\n\t\t\t<div data-bind="{{=it.dataBind(\'panelBodyBindings\')}}" >\r\n\t\t\t\t{{=it.getToolbars()}}\r\n\t\t\t\t<div data-bind="{{=it.dataBind(\'panelItemBindings\')}}">\r\n\t\t\t\t\t{{=it.getItems()}}\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n</div>';});


define('text!Firebrick.ui/containers/panel/Icon.html',[],function () { return '{{?it.scope[it.property] && it.scope[it.showProperty] !== false}}\r\n\t<a data-bind="{{=it.scope.dataBind(it.bindingMethod)}}"></a>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Panel
 */
define( 'Firebrick.ui/containers/Panel',[ "text!./Panel.html", "text!./panel/Icon.html", "jquery", "doT", "./Base", "../nav/Toolbar", "../common/mixins/Toolbars", "../common/mixins/Label" ], function( tpl, iconTpl, $, doT ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Panel", {
		extend: "Firebrick.ui.containers.Base",
		mixins: [ "Firebrick.ui.common.mixins.Toolbars",
		         "Firebrick.ui.common.mixins.Label" ],
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.panel",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * used to the default header icons
		 * @property iconTpl
		 * @type {String} html
		 */
		iconTpl: iconTpl,
		/**
		 * @property role
		 * @type {String}
		 * @default ""
		 */
		role: "",
		/**
		 * @property collapseRole
		 * @type {String}
		 * @default ""
		 */
		collapseRole: "",
		/**
		 * @property title
		 * @type {String|false} set to false to hide the title
		 * @default ""
		 */
		title: "",
		/**
		 * use to determine whether h1, h2, h3 etc - default = 3
		 * @property headerSize
		 * @type {Int}
		 * @default 3
		 */
		headerSize: 3,
		/**
		 * @property panelClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelClass: true,
		/**
		 * string = (default, primary, success, info, warning, danger)
		 * @property panelTypeClass
		 * @type {Boolean|String}
		 * @default "default"
		 */
		panelTypeClass: "default",
		/**
		 * @property panelHeaderClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelHeaderClass: true,
		/**
		 * @property panelBodyClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelBodyClass: true,
		/**
		 * determines whether "panel-title" class is used
		 * @property
		 * @type {Boolean}
		 * @default true
		 */
		panelTitleClass: true,
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String|Function}
		 * @default ""
		 */
		html: "",
		/**
		 * @property collapsible
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsible: false,
		/**
		 * @property showCollapseIcon
		 * @type {Boolean}
		 * @default true
		 */
		showCollapseIcon: true,
		/**
		 * @property collapsed
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsed: false,
		/**
		 * @private
		 * @property _collapsedState
		 * @type {Boolean}
		 * @default false
		 */
		_collapsedState: false,
		/**
		 * @property headerItems
		 * @type {Boolean|Array of Objects} boolean = false, if object use the same way as the "items" property
		 * @default false
		 */
		headerItems: false,
		/**
		 * @property headerIconsPosition
		 * @type {String|false} css class "pull-right", "pull-left" etc
		 * @default "pull-right"
		 */
		headerItemsPosition: "pull-right",
		/**
		 * @private
		 * @property _collapsedClass
		 * @type {String}
		 * @default "fb-ui-is-collapsed"
		 */
		_collapsedClass: "fb-ui-is-collapsed",
		/**
		 * only needed when panel is inside accordion
		 * @property dataParentId
		 * @type {String}
		 * @default ""
		 */
		dataParentId: "",
		/**
		 * only needed when panel is inside accordion
		 * @property active
		 * @type {Boolean}
		 * @default false
		 */
		active: false,
		/**
		 * @property maximizable
		 * @type {Boolean}
		 * @default false
		 */
		maximizable: false,
		/**
		 * array of icon posibilites after headerItems (custom), like collapse icon, maximize icon etc
		 * @property _defaultPanelIcons
		 * @private
		 * @type {Array of Strings}
		 * @default ["maximizable", "collapsible"]
		 */
		_defaultPanelIcons: [ "collapsible", "maximizable" ],
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function() {
			var me = this;
			
			me._collapsedState = me.collapsed;
			
			me.on( "rendered", function() {
				var panel = me.getElement(),
					eventFunction;

				if ( me.collapsed ) {
					panel.addClass( me._collapsedClass );
				}
				
				eventFunction = function() {
					panel.toggleClass( me._collapsedClass );
					panel.trigger( "fb-ui-panel-state-change" );
					me._collapsedState = !me._collapsedState;	//toggle value
				};
				
				//this is important for the collapse icon
				panel.on( "show.bs.collapse hide.bs.collapse", eventFunction );
				
				me.on( "unbound", function() {
					panel.off( "show.bs.collapse hide.bs.collapse", eventFunction );
				});
				
			});
			
			return me.callParent( arguments );
		},
		
		/**
		 * programmatically make toggleCollapse action - useful if the header isn't available
		 * @method toggleCollapse
		 * @return self
		 */
		toggleCollapse: function() {
			var me = this;
				
			if ( me._collapsedState ) {
				me.expand();
			} else {
				me.collapse();
			}
			
			return me;
		},
		/**
		 * used within the Panel.html template
		 * iterates through the _defaultPanelIcons array and builds for each value a
		 * template from panel/Icon (this.iconTpl) together for each property
		 * @private
		 * @method defaultPanelIcons
		 * @return {String} html
		 */
		getDefaultIcons: function() {
			var me = this,
				it,
				icons = me._defaultPanelIcons,
				html = "",
				conf;
			
			for ( var i = 0, l = icons.length; i < l; i++ ) {
				it = icons[ i ];
				conf = {
					property: icons[ i ],
					showProperty: "show" + Firebrick.utils.firstToUpper( it ),
					bindingMethod: it + "IconBindings",
					scope: me
				};
				html += doT.template( me.iconTpl )( conf );
			}
			
			return html;
		},
		/**
		 * programmatically make a collapse action - useful if the header isn't available
		 * @method collapse
		 * @return self
		 */
		collapse: function() {
			var me = this,
				panel = me.getElement(),
				collapsiblePart = $( "> .panel-collapse", panel );
		
			collapsiblePart.collapse( "hide" );
			
			return me;
		},
		
		/**
		 * programmatically make an expand action - useful if the header isn't available
		 * @method expand
		 * @return self
		 */
		expand: function() {
			var me = this,
				panel = me.getElement(),
				collapsiblePart = $( "> .panel-collapse", panel );
	
			collapsiblePart.collapse( "show" );
			
			return me;
		},
		
		/**
		 * Data bindings
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );

			obj.css.panel = me.panelClass;

			if ( me.panelTypeClass ) {
				obj.css[ me.parseBind( "panel-" + me.panelTypeClass ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method tabBindings
		 * @return {Object}
		 */
		tabBindings: function() {
			var me = this,
				obj = {
					css: {},
					attr: {
						id: me.parseBind( "fb-ui-collapse-" + me.getId() )
					}
			};
			
			if ( me.collapsible ) {
				obj.css[ "'panel-collapse'" ] = me.collapsible;
				obj.css.collapse = me.collapsible;
				if ( !me.collapsed ) {
					obj.css[ "in" ] = true;
				}
			} else if ( me.collapsed ) {
				//just collapsed
				obj.css[ "'panel-collapse'" ] = true;
				obj.css.collapse = true;
			}
			
			if ( me.collapseRole ) {
				obj.attr.role = me.parseBind( me.collapseRole );
			}
			
			obj.css[ "'fb-ui-panel-body-container'" ] = true;
			return obj;
		},
		/**
		 * @method panelHeaderBindings
		 * @return {Object}
		 */
		panelHeaderBindings: function() {
			var me = this,
				obj = {
					css: {
						"'panel-heading'": me.panelHeaderClass
					},
					attr: {}
			};
			
			if ( me.headerItems ) {
				obj.css.clearfix = true;
			}
			
			if ( me.role ) {
				obj.attr.role = me.parseBind( me.role );
			}
			
			return obj;
		},
		/**
		 * @method headerItemsBindings
		 * @return {Object}
		 */
		headerItemsBindings: function() {
			var me = this,
				obj = {
					css: {
						"'btn-group'": true
					}
				};
			
			if ( me.headerItemsPosition ) {
				obj.css[ me.parseBind( me.headerItemsPosition ) ] = true;
			}
			
			return obj;
			
		},
		/**
		 * @method collapsibleLinkBindings
		 * @return {Object}
		 */
		collapsibleLinkBindings: function() {
			var me = this,
				id = "fb-ui-collapse-" + me.getId(),
				obj = {
					css: {
						"'fb-ui-title-link'": true
					},
					attr: {
						"'data-toggle'":  "'collapse'",
						"'data-target'":  me.parseBind( "#" + id ),
						"'aria-expanded'": typeof me.collapsed === "boolean" ? me.collapsed : true,
						"'aria-controls'":  me.parseBind( id )
					}
				};
			
			if ( me.dataParentId ) {
				obj.attr[ "'data-parent'" ] = me.dataParentId;
			}
			
			return obj;
		},
		
		/**
		 * @method collapsibleIconBindings
		 * @return {Object}
		 */
		collapsibleIconBindings: function() {
			var me = this,
				obj = {
					css: {
						"'fb-ui-panel-icon'": true,
						"'fb-ui-collapse-icon'": true
					},
					attr: {}
				};
			
			obj.click = "function(){ return Firebrick.ui.helper.callFunction('" + me.getId() + "', '_collapseIconClick', arguments)}";
			
			return obj;
		},
		/**
		 * simulate a click on the icon and delegate it to the title
		 * @method _collapseIconClick
		 * @private
		 * @param obj
		 * @param event {Object} jquery event
		 */
		_collapseIconClick: function( ) {
			var me = this;
			me.toggleCollapse();
		},
		/**
		 * @method maximizableIconBindings
		 * @return {Object}
		 */
		maximizableIconBindings: function() {
			var obj = {
					css: {
						"'fb-ui-panel-icon'": true,
						"glyphicon": true,
						"'glyphicon-fullscreen'": true
					}
				};
			
			return obj;
		},
		/**
		 * @method panelHeaderTextBindings
		 * @return {Object}
		 */
		panelHeaderTextBindings: function() {
			var me = this,
				obj = {
						css: {
							"'panel-title'": me.panelTitleClass
						}
					};
			
			if ( typeof me.title !== "boolean" ) {
				obj.text = me.textBind( "title" );
			}
			
			if ( me.headerItems ) {
				obj.css[ "'pull-left'" ] = true;
			}
			
			if ( me.labelText ) {
				obj.css[ "'fb-ui-has-label'" ] = true;
			}
			
			return obj;
		},
		/**
		 * @method panelBodyBindings
		 * @return {Object}
		 */
		panelBodyBindings: function() {
			var me = this,
				obj = {
					css: {
						"'panel-body'": me.panelBodyClass
					}
				};

			me.toolbarContainer( obj );
			
			return obj;
		},
		/**
		 * @method panelItemBindings
		 * @return {Object}
		 */
		panelItemBindings: function() {
			var me = this,
				obj = {};

			//no items are defined or it is an empty array
			if ( !me.items || ( me.items && !me.items.length ) ) {
				obj.html = "Firebrick.ui.helper.getHtml( '" + me.getId() + "', $data, $context )";
			}
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Accordion
 */
define( 'Firebrick.ui/containers/Accordion',[ "text!./Accordion.html", "./Base", "./Panel", "bootstrap.plugins/collapse" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Accordion", {
		extend: "Firebrick.ui.containers.Base",
		/**
		 * @property tpl
		 * @type {String} html
		 * @default Accordion.html
		 */
		tpl: tpl,
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.accordion",
		
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {
		 * 		sName: "containers.panel"
		 * }
		 */
		defaults: {
			sName: "containers.panel",
			collapsible: true,
			role: "tab",
			collapseRole: "tabpanel"
		},
		/**
		 * @property role
		 * @type {String}
		 * @default "tablist"
		 */
		role: "tablist",
		/**
		 * @property ariaMultiselectable
		 * @type {Boolean}
		 * @default true
		 */
		ariaMultiselectable: true,
		/**
		 * @property panelGroupClass
		 * @type {String|false}
		 * @default "panel-group"
		 */
		panelGroupClass: "panel-group",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			//<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
			
			obj.attr.role = me.parseBind( me.role );
			obj.attr[ "'aria-multiselectable'" ] = me.ariaMultiselectable;
			if ( me.panelGroupClass ) {
				obj.css[ me.parseBind( me.panelGroupClass ) ] = true;
			}
			
			return obj;
		},
		
		getItems: function() {
			var me = this,
				item;
			
			for ( var i = 0, l = me.items.length; i < l; i++ ) {
				item = me.items[ i ];
				item.dataParentId = me.parseBind( "#" + me.getId() );
				item.collapsed = item.active ? false : true;
			}
			
			return me.callParent( arguments );
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * built on the back of: http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
 *
 * @module plugins
 * @namespace plugins
 * @class Draggable
 */
define( 'Firebrick.ui/containers/border/Draggable',[ "jquery" ], function( $ ) {
	"use strict";

	/**
	 * @method drags
	 * @event dragged - fired on mouseup
	 * set property "dragDisabled" on element to disable dragging at anytime
	 * @example
	 * 		jqueryEl.prop("dragDisabled", {true|false});
	 * @example
	 * 		jqueryEl.drags("vertical");
	 * 		jqueryEl.drags("horizontal");
	 */
	$.fn.drags = function( direction, opt ) {
		var $el, origPageX, origPageY, top, left, correctPageCoord = function( event, axis ) {
			axis = axis.toUpperCase();

			//get the correct page(X|Y) coord depending on whether it is a touch device
			if ( event.type.indexOf( "touch" ) >= 0 ) {
				return event.originalEvent.targetTouches[ 0 ][ "page" + axis ];
			} else {
				return event[ "page" + axis ];
			}

		};

		direction = direction.toLowerCase();
		opt = $.extend( {
			handle: ""
		}, opt );

		if ( opt.handle === "" ) {
			$el = this;
		} else {
			$el = this.find( opt.handle );
		}

		if ( $el.prop( "dragSet" ) === true ) {
			return $el;
		}

		//set a prop on the element to ensure that the event aren't registered more than once
		$el.prop( "dragSet", true );

		return $el.on( "mouseover", function() {
			var $drag = $( this );
			if ( $drag.prop( "dragDisabled" ) === true ) {
				$drag.css( "cursor", "auto" );
			} else {
				$drag.css( "cursor", "" );
			}
		} ).on( "mousedown touchstart", function( e ) {
			var $drag = !opt.handle ? $( this ).addClass( "draggable" ) : $( this ).addClass( "active-handle" ).parent().addClass( "draggable" ), zIdx = $drag.css( "z-index" ), drgH = $drag.outerHeight(), drgW = $drag.outerWidth(), posY = $drag.offset().top + drgH - correctPageCoord( e, "y" ), posX = $drag.offset().left + drgW - correctPageCoord( e, "x" ), mouseMove;

			origPageY = correctPageCoord( e, "y" );
			origPageX = correctPageCoord( e, "x" );

			mouseMove = function( e ) {
				top = ( direction === "horizontal" ? origPageY : correctPageCoord( e, "y" ) ) + posY - drgH;
				left = ( direction === "vertical" ? origPageX : correctPageCoord( e, "x" ) ) + posX - drgW;
				$drag.offset( {
				    top: top,
				    left: left
				} );
			};

			$drag.on( "mouseup touchend", function() {
				$drag.removeClass( "draggable" ).css( "z-index", zIdx );
				//remove handler
				$( "html" ).off( "mousemove touchmove", "body", mouseMove );
			} );

			if ( $drag.prop( "dragDisabled" ) === true ) {
				$( "html" ).off( "mousemove touchmove", "body", mouseMove );
			} else {
				$drag.css( "z-index", 1000 );
				//add handler
				$( "html" ).on( "mousemove touchmove", "body", mouseMove );
			}

			e.preventDefault(); // disable selection

		} ).on( "mouseup touchend", function() {
			var $this = $( this );
			if ( $this.prop( "dragDisabled" ) !== true ) {
				if ( opt.handle === "" ) {
					$this.removeClass( "draggable" );
				} else {
					$this.removeClass( "active-handle" ).parent().removeClass( "draggable" );
				}
				$this.trigger( "dragged", [ top - origPageY, left - origPageX ] );
				$this.css( {
				    top: 0,
				    left: 0
				} );
			}
		} );

	};

} );


define('text!Firebrick.ui/containers/border/SplitBar.html',[],function () { return '{{?it.resizable || it.collapsible}}\r\n<div id="{{=it.getSplitBarId()}}" data-bind="{{=it.dataBind(\'splitBarBindings\')}}">\r\n\t{{?it.collapsible}}\r\n\t\t<span data-bind="{{=it.dataBind(\'splitBarCollapseBindings\')}}"></span>\r\n\t{{?}}\r\n</div>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 *
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers.border
 * @class Pane
 */
define( 'Firebrick.ui/containers/border/Pane',[ "text!./SplitBar.html", "jquery", "../../common/mixins/Column", "./Draggable", "../Panel" ], function( splitBarTpl, $ ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.border.Pane", {
		extend: "Firebrick.ui.containers.Panel",
		mixins: "Firebrick.ui.common.mixins.Column",
		/**
		 * @property sName
		 * @type {String}
		 * @default "containers.border.pane"
		 */
		sName: "containers.border.pane",
		/**
		 * @property resizable
		 * @type {Boolean}
		 * @default false
		 */
		resizable: false,
		/**
		 * @property position
		 * @type {String} "top", "left", "center", "right", "bottom"
		 * @default ""
		 */
		position: "",
		/**
		 * @property collapseDirection
		 * @type {String}
		 * @default "left"
		 */
		collapseDirection: "left",
		/**
		 * @property splitBarIdPrefix
		 * @type {String}
		 * @default "fb-ui-splitbar-r"
		 */
		splitBarIdPrefix: "fb-ui-splitbar-",
		/**
		 * @private
		 * @property splitBarTpl
		 * @type {HTML}
		 * @default SplitBar.html
		 */
		splitBarTpl: splitBarTpl,
		/**
		 * @private
		 * @property _rotatedHeadingClass
		 * @type {String}
		 * @default "panel-rotated-heading"
		 */
		_rotatedHeadingClass: "panel-rotated-heading",
		/**
		 * @private
		 * @property _rotatedHeadingClass
		 * @type {String}
		 * @default "panel-rotated-heading"
		 */
		_rotatedTitleClass: "panel-rotated-title",
		/**
		 * @private
		 * @property _positionPrefixClass
		 * @type {String}
		 * @default "fb-ui-pane-position-"
		 */
		_positionPrefixClass: "fb-ui-pane-position-",
		/**
		 * @private
		 * @property _transitionClass
		 * @type {String}
		 * @default "fb-ui-transition"
		 */
		_transitionClass: "fb-ui-transition",
		/**
		 * @property height
		 * @type {Integer|String}
		 * @default "auto"
		 */
		height: "auto",
		/**
		 * only used for left and right panes
		 * @property width
		 * @type {Integer|String}
		 * @default "33%"
		 */
		width: "33%",
		/**
		 * @property title
		 * @type {String}
		 * @default false
		 */
		title: false,
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function() {
			var me = this;
			
			me.on( "htmlRendered", function() {
				return me._htmlRendered.apply( me, arguments );
			});
			
			me.on( "rendered", function() {
				return me._rendered.apply( me, arguments );
			});
			
			return me.callParent( arguments );
		},
		
		/**
		 * listener for the event htmlRendered
		 * in this function the splitbar is added to its correct position
		 * only if the pane is resizable
		 * @private
		 * @method _htmlRendered
		 */
		_htmlRendered: function() {
			var me = this,
				el, splitBarHtml,
				position = me.position;
			
			if ( position !== "center" ) {
				el = me.getElement();
				if ( el ) {
					me.template( "splitBarTpl" );
					splitBarHtml = me.build( "splitBarTpl" );
					if ( position !== "right" && position !== "bottom" ) {
						el.after( splitBarHtml );
					} else {
						el.before( splitBarHtml );
					}
					
				}
			}
			
			me._setDimensions();
			
		},
		
		/**
		 * accepts no parameters
		 * @private
		 * @method _setDimensions
		 */
		_setDimensions: function() {
			var me = this,
				el = me.getElement(),
				position = me.position,
				height = me.height,
				width = me.width;

			if ( position === "top" || position === "bottom" ) {
				if ( height !== "auto" ) {
					el.css( "height", height );
					el.css( "min-height", height );
				}
			}
			
			if ( position === "left" || position === "right" ) {
				el.css( "width", width );
				el.css( "min-width", width );
			}
			
		},

		/**
		 * listener for the event rendered
		 * @private
		 * @method _rendered
		 */
		_rendered: function() {
			var me = this,
				pane = me.getElement(),
				position = me.position,
				direction = position === "top" || position === "bottom" ? "vertical" : "horizontal",
				lookMethod = position === "top" || position === "left" ? "next" : "prev",
				splitBar = pane[ lookMethod ]( ".fb-ui-splitbar" );
			
			pane.prop( "fb-direction", direction );
			pane.prop( "fb-splitbar", splitBar );
			if ( me.collapsible ) {
				splitBar.on( "click touchstart", "> .fb-ui-collapse-icon", function() {
					me.toggleCollapse.call( me );
				});
				me.setCollapsibleActions();
			}
			
			if ( me.resizable ) {
				me.setResizableActions();
			}

			if ( me.resizable || me.collapsible ) {
				pane.on( "fb-ui-panel-state-change", function() {
					//disable resize if the pane is collapsed
					if ( pane.hasClass( me._collapsedClass ) ) {
						me.onCollapsed();
					} else {
						me.onExpanded();
					}
				});
			}
		},
		
		/**
		 * @method collapse
		 */
		
		/**
		 * @method setCollapsibleActions
		 */
		setCollapsibleActions: function() {
			var me = this,
				el = me.getElement(),
				position = me.position;
			
			if ( position === "left" || position === "right" ) {
				$( "> .panel-collapse", el ).on( "hide.bs.collapse", function() {
					return me._onRLPaneCollapse.apply( me, arguments );
				});
				
				$( "> .panel-collapse", el ).on( "show.bs.collapse", function() {
					return me._onRLPaneExpand.apply( me, arguments );
				});
			} else {
				//bottom & top panes
				$( "> .panel-collapse", el ).on( "hide.bs.collapse", function() {
					return me._onTBPaneCollapse.apply( me, arguments );
				});
				$( "> .panel-collapse", el ).on( "show.bs.collapse", function() {
					return me._onTBPaneExpand.apply( me, arguments );
				});
			}
		},
		
		/**
		 * @method setResizableActions
		 */
		setResizableActions: function() {
			var me = this,
				position = me.position,
				pane = me.getElement(),
				paneHeader = $( "> .panel-heading", pane ),
				direction = pane.prop( "fb-direction" ),
				splitbar = pane.prop( "fb-splitbar" );
				
			if ( splitbar.length ) {
				if ( direction === "vertical" ) {
					//top bottom panes

					//if the class if NOT collapsed from the start, then enable resizing
					if ( !pane.hasClass( me._collapsedClass ) ) {
						me.onExpanded();
					}
					
					//when the splitbar has been dragged, if the panel a new height
					splitbar.on( "dragged", function( event, top/*, left*/ ) {
						var val;
						if ( position === "top" ) {
							val = pane.height() + top;
							if ( val > 0 ) {
								//subtract the header height to position the splitbar in the right place
								val -= paneHeader.height();
							}
							pane.css( "height", val );
							pane.css( "min-height", val );
						} else {
							val = pane.height() - top;
							if ( val < 0 ) {
								//add the header height to position the splitbar in the right place
								val += paneHeader.height();
							}
							pane.css( "height", val );
							pane.css( "min-height", val );
						}
						
					});
					
				} else {
					
					//if the pane is NOT collapsed from the start, enable resize functionality
					if ( !pane.hasClass( me._collapsedClass ) ) {
						me.onExpanded();
					}
					
					//when the splitbar has been moved, calculate the new width of the pane
					splitbar.on( "dragged", function( event, top, left ) {
						var width = pane.width();
						if ( position === "right" ) {
							pane.width( width - left );
							pane.css( "min-width", width - left );
						} else {
							pane.width( width + left );
							pane.css( "min-width", width + left );
						}
						
					});
				}

			}
		},
		
		/**
		 * event callback (jQuery)
		 * top and bottom pane
		 * @private
		 * @method _onTBPaneCollapse
		 * @param me {Object} this class
		 * @param el {jQuery Object} panel|pane
		 */
		_onTBPaneCollapse: function() {
			var me = this,
				pane = me.getElement(),
				paneHeader = $( "> .panel-heading", pane ),
				paneHeaderHeight = paneHeader.outerHeight();

			if ( !pane.prop( "_fbResizeHeight" ) ) {
				//first time this is collapse - set the current height/min-height to the current values
				//if not set, css snaps a little and does not do the animation/transition properly
				pane.css( "min-height", pane.css( "min-height" ) );
				pane.css( "height", pane.css( "height" ) );
			}
			
			pane.addClass( me._transitionClass );

			pane.prop( "_fbResizeHeight", pane.css( "height" ) );	//save the height in the property, this is needed for transitions when the pane is expaneded again
			pane.css( "min-height", paneHeaderHeight );
			pane.css( "height", paneHeaderHeight );
			
			pane.one( "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
				pane.removeClass( me._transitionClass );
			});
		},
		
		/**
		 * event callback (jQuery)
		 * top and bottom pane
		 * @private
		 * @method _onTBPaneExpand
		 * @param me {Object} this class
		 * @param el {jQuery Object} panel|pane
		 */
		_onTBPaneExpand: function() {
			var me = this,
				pane = me.getElement();
			
			//start transition
			pane.addClass( me._transitionClass );
			pane.css( "min-height", pane.prop( "_fbResizeHeight" ) );
			pane.css( "height", pane.prop( "_fbResizeHeight" ) );
			
			//listener when the transition has ended
			pane.one( "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
				pane.removeClass( me._transitionClass );
			});
		},
		
		/**
		 * right and left pane
		 * event callback (jQuery)
		 * @private
		 * @method _onRLPaneExpand
		 * @param event {jQuery event Object}
		 */
		_onRLPaneExpand: function() {
			var me = this,
				pane = me.getElement(),
				paneHeader = $( "> .panel-heading", pane ),
				paneTitle = $( ".panel-title", paneHeader );
			
			//start transition
			pane.addClass( me._transitionClass );
			pane.trigger( "pane-expanding" );
			
			//remove the rotated effect on the panel title
			paneHeader.removeClass( me._rotatedHeadingClass );
			paneTitle.removeClass( me._rotatedTitleClass );
			
			pane.css( "min-width", pane.prop( "_fbResizeWidth" ) );
			
			//listener for when the transition has ended
			pane.one( "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
				pane.removeClass( me._transitionClass );
			});
			
		},
		
		/**
		 * right and left pane
		 * event callback (jQuery)
		 * @private
		 * @method _onRLPaneCollapse
		 * @param event {jQuery event Object}
		 */
		_onRLPaneCollapse: function() {
			var me = this,
				pane = me.getElement(),
				paneHeader = $( "> .panel-heading", pane ),
				paneTitle = $( ".panel-title", paneHeader ),
				paneHeaderHeight = paneHeader.outerHeight() || 0;
			
			//start transition
			pane.addClass( me._transitionClass );
			pane.trigger( "pane-collapsing" );
			
			pane.prop( "_fbResizeWidth", pane.css( "width" ) );	//save the width in the property, this is needed for transitions when the pane is expaneded again
			
			pane.css( "min-width", paneHeaderHeight );
			pane.css( "width", paneHeaderHeight );
			
			//listener for when the transition has ended
			pane.one( "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
				//rotate header & title
				paneHeader.addClass( me._rotatedHeadingClass );
				paneTitle.addClass( me._rotatedTitleClass );
				
				pane.removeClass( me._transitionClass );
			});
			
		},
		
		/**
		 * enable drags function on element
		 * @method onExpanded
		 */
		onExpanded: function() {
			var me = this,
				pane = me.getElement(),
				direction = pane.prop( "fb-direction" ),
				splitBar = pane.prop( "fb-splitbar" );
			
			if ( splitBar.length && me.resizable ) {
				splitBar.prop( "dragDisabled", false );
				splitBar.drags( direction );
			}
			
			splitBar.removeClass( "fb-ui-is-collapsed" );
		},
		/**
		 * disable drags function on element
		 * @method onCollapsed
		 */
		onCollapsed: function() {
			var me = this,
				pane = me.getElement(),
				splitBar = pane.prop( "fb-splitbar" );
			
			if ( splitBar.length && me.resizable ) {
				splitBar.prop( "dragDisabled", true );
			}
			
			splitBar.addClass( "fb-ui-is-collapsed" );
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'fb-ui-border-pane'" ] = true;
			
			//type of pane - top, right, left etc..
			obj.css[ me.parseBind( me._positionPrefixClass + me.position ) ] = true;
			
			if ( me.collapsible ) {
				obj.css[ "'fb-ui-pane-collapsible'" ] = true;
			}
			
			return obj;
		},
		
		/**
		 * @method splitBarBindings
		 * @return {Object}
		 */
		splitBarBindings: function() {
			var me = this,
				obj = {
					css: {
						"'fb-ui-splitbar'": true
					},
					attr: {}
				};

			obj.css[ me.parseBind( "fb-ui-splitbar-" + me.position ) ] = true;
			
			if ( me.resizable ) {
				if ( me.position === "top" || me.position === "bottom" ) {
//					obj.css.col = true;
//					obj.css[me.parseBind("col-" + me.deviceSize + "-12")] = true;
					obj.css[ "'fb-ui-splitbar-horizontal'" ] = true;
				} else {
					obj.css[ "'fb-ui-splitbar-vertical'" ] = true;
				}
			}
			
			if ( me.collapsible ) {

				obj.css[ "'fb-ui-collapsebar'" ] = true;
				
			}
			
			return obj;
		},
		
		/**
		 * @method getSplitBarId
		 * @return {String}
		 */
		getSplitBarId: function() {
			var me = this;
			return me.splitBarIdPrefix + me.getId();
		},
		
		/**
		 * @method  splitBarCollapseBindings
		 * @return {Object}
		 */
		splitBarCollapseBindings: function() {
			var me = this,
				obj = {
					css: {}
			};
			
			obj.css.glyphicon = true;
			obj.css[ "'fb-ui-collapse-icon'" ] = true;
			
			if ( me.position === "left" ) {
				obj.css[ "'glyphicon-chevron-left'" ] = true;
			} else if ( me.position === "right" ) {
				obj.css[ "'glyphicon-chevron-right'" ] = true;
			} else if ( me.position === "top" ) {
				obj.css[ "'glyphicon-chevron-up'" ] = true;
			} else if ( me.position === "bottom" ) {
				obj.css[ "'glyphicon-chevron-down'" ] = true;
			}
			
			return obj;
		},
		
		/**
		 * @method panelBodyBindings
		 * @return {Object}
		 */
		panelBodyBindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css = obj.css || {};
			obj.css[ "'fb-ui-border-pane-body'" ] = true;
			
			return obj;
		}
		
	});
});


define('text!Firebrick.ui/containers/BorderLayout.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\r\n\t{{=it.getItems()}}\r\n\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class BorderLayout
 */
define( 'Firebrick.ui/containers/BorderLayout',[ "text!./BorderLayout.html", "./Base", "./Box", "./border/Pane" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.BorderLayout", {
		extend: "Firebrick.ui.containers.Base",
		/**
		 * @property tpl
		 * @type {String} html
		 * @default BorderLayout.html
		 */
		tpl: tpl,
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.borderlayout",
		
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {
		 * 		sName: "containers.border.pane"
		 * }
		 */
		defaults: {
			sName: "containers.border.pane"
		},
		
		/**
		 * @example
		 * 		items:[{
		 * 			position: "top",	//top, right, bottom, left, center
		 * 			//GridCol properties...
		 * 			items:[{
		 * 				...
		 * 			}];
		 * 		}]
		 * @property items
		 * @type {Array of Objects}
		 * @default null
		 */
		items: null,
		
		/**
		 * number of cols in Bootstraps grid system
		 * do no alter this unless BS changes it
		 * @private
		 * @property _maxGridCols
		 * @type {Integer}
		 * @default 12
		 */
		_maxGridCols: 12,
		/**
		 * @property defaultSizes
		 * @type {Object}
		 * @default {
		 * 		top: 12,
		 * 		right: 3,
		 * 		bottom: 12,
		 * 		left: 3,
		 * 		center: 6
		 * }
		 */
		defaultSizes: {
			top: "100%",
			right: "33%",
			bottom: "100%",
			left: "33%"
		},
		/**
		 *
		 * @property height
		 * @type {Integer|String} px value | auto | fit
		 * @default "auto"
		 */
		height: "fit",
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function() {
			var me = this,
				resize;
			
			me.on( "rendered", function() {
				var el = me.getElement(),
					height = me.height;
				if ( height === "fit" ) {
					//set a fixed height for the borderLayout so that the height
					//of the vertical panes grow in the correct direction
					el.css( "height", el.parent().height() );
					resize = function() {
						el.css( "height", el.parent().height() );
					};
					$( window ).on( "resize", resize );
					me.on( "unbound", function() {
						$( window ).off( "resize", resize );
					});
				} else if ( height !== "auto" ) {
					//not fixed and not auto
					el.css( "height", height );
				}
			});
			
			return me.callParent( arguments );
		},
		/**
		 * overriding base method build
		 * @private
		 * @method build
		 */
		build: function() {
			var me = this,
				map = {},
				reorderedItems = [],
				item,
				position,
				length,
				centerGrid = {
					sName: "containers.box",
					defaults: me.defaults,
					css: "row-eq-height fb-ui-center-row",
					items: []
				},
				entered = false;
			
			//if items is defined and has >= 1 item
			if ( me.items ) {
				
				length = me.items.length;
				
				if ( length ) {
					for ( var i = 0; i < length; i++ ) {
						item = me.items[ i ];	//get current item in iteration
						//get the correct position where this item should be: 0 - 4
						item.position = item.position.toLowerCase();
						position = me._itemArrayPosition( item.position );
						//store the position and item
						map[ position ] = item;
					}
					
					for ( var ii = 0; ii < 5; ii++ ) {
						//get each item from the map in the correct order
						item = map[ ii ];
						//check if the item was defined
						if ( item ) {
							//get the correct dimensions
							if ( ii > 0 && ii < 4 ) {
								//center pieces
								// 1|2|3
								centerGrid.items.push( item );
								if ( centerGrid.items.length && !entered ) {
									entered = true;
									reorderedItems.push( centerGrid );
								}
							} else {
								//place the item in the correct order
								reorderedItems.push( item );
							}
							
						}
					}
					//replace the items with the same ones but in the correct order
					me.items = reorderedItems;
				}
				
			}
			return me.callParent( arguments );
		},
		
		/**
		 * get item border position
		 *
		 * ---- 0 ----
		 * 1 | 2 | 3 |
		 * ---- 4 ----
		 *
		 * @method _itemArrayPosition
		 * @param position {String} top, right, bottom, left, center
		 * @return {Integer}
		 */
		_itemArrayPosition: function( position ) {
			var pos;
			
			if ( position === "top" ) {
				pos = 0;
			} else if ( position === "left" ) {
				pos = 1;
			} else if ( position === "center" ) {
				pos = 2;
			} else if ( position === "right" ) {
				pos = 3;
			} else if ( position === "bottom" ) {
				pos = 4;
			}
			
			return pos;
		},
		
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'fb-ui-borderlayout'" ] = true;
			
			return obj;
		}
		
	});
});


define('text!Firebrick.ui/containers/Fieldset.html',[],function () { return '<fieldset id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{?it.showLegend}}\r\n\t\t{{?it.collapsible}}\r\n\t\t\t<a data-bind="{{=it.dataBind(\'collapsibleLinkBindings\')}}">\r\n\t\t{{?}}\r\n\t\t\t<legend data-bind="{{=it.dataBind(\'legendBindings\')}}">\r\n\t\t\t\t{{?it.collapsible}}\r\n\t\t\t\t\t<span data-bind="{{=it.dataBind(\'collapsibleBindings\')}}"></span>\r\n\t\t\t\t{{?}}\r\n\t\t\t\t<span data-bind="{{=it.dataBind(\'legendTextBindings\')}}"></span>\r\n\t\t\t\t{{=it.getLabelTpl()}}\r\n\t\t\t</legend>\r\n\t\t{{?it.collapsible}}\r\n\t\t\t</a>\r\n\t\t{{?}}\r\n\t{{?}}\r\n\r\n\t<div data-bind="{{=it.dataBind(\'contentBindings\')}}">\r\n\t\t{{=it.getItems()}}\r\n\t</div>\r\n\r\n</fieldset>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Fieldset
 */
define( 'Firebrick.ui/containers/Fieldset',[ "text!./Fieldset.html", "jquery", "../common/mixins/Label" ], function( tpl, $ ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Fieldset", {
		extend: "Firebrick.ui.containers.Base",
		mixins: "Firebrick.ui.common.mixins.Label",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.fieldset",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @property title
		 * @type {String}
		 * @default ""
		 */
		title: "",
		/**
		 * @property collapsible
		 * @type {Boolean}
		 * @default false
		 */
		collapsible: false,
		/**
		 * @property collapsed
		 * @type {Boolean}
		 * @default false
		 */
		collapsed: false,
		/**
		 * @property fieldsetBodyClass
		 * @type {String}
		 * @default "fb-ui-fieldset-body"
		 */
		fieldsetBodyClass: "fb-ui-fieldset-body",
		/**
		 * @property showLegend
		 * @type {Boolean}
		 * @default true
		 */
		showLegend: true,
		/**
		 * on the entire fieldset. See: collapseIconClass/expandIconClass for legend icon
		 * @property collapsedClass
		 * @type {String}
		 * @default "collapsed"
		 */
		collapsedClass: "collapsed",
		/**
		 * adds class form-horizontal to fieldset
		 * @property formHorizontalClass
		 * @type {Boolean}
		 * @default true
		 */
		formHorizontalClass: true,
		/**
		 * css is animated or not
		 * @property animated
		 * @type {Boolean}
		 * @default true
		 */
		animated: true,
		/**
		 * css class for icon to expand when collapsed
		 * @property expandIconClass
		 * @type {String|false}
		 * @default "glyphicon-chevron-up"
		 */
		expandIconClass: "glyphicon-chevron-right",
		/**
		 * css class for icon to collapse when expanded
		 * @property collapseIconClass
		 * @type {String|false}
		 * @default "glyphicon-chevron-down"
		 */
		collapseIconClass: "glyphicon-chevron-down",
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function() {
			var me = this,
				obj = me.callParent();
			
			me.on( "rendered", function() {
				var el = me.getElement(),
					linkEl = $( "> a[data-collapse='" + me.getId() + "']", el );
				
				linkEl.on( "click", function() {
					me.collapseClick.apply( me, arguments );
				});
				
			});
			
			return obj;
		},
		/**
		 * @method bindings
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'form-horizontal'" ] = me.formHorizontalClass;
			
			return obj;
		},
		/**
		 * called when the legend is clicked on
		 * @method collapseClick
		 * @param jQuery "click" event arguments {Any}
		 */
		collapseClick: function( event ) {
			var me = this,
				el, body, title;
			
			event.preventDefault();
			
			//init after preventDefault
			el = me.getElement();
			body = $( "> div." + me.fieldsetBodyClass, el );
			title = $( "> a > legend > span.fb-ui-collapsed-icon", el );

			//TODO: animation
			if ( body.is( ":visible" ) ) {
				title.removeClass( me.collapseIconClass );
				title.addClass( me.expandIconClass );
				
				el.addClass( me.collapsedClass );
				body.hide();
			} else {
				title.removeClass( me.expandIconClass );
				title.addClass( me.collapseIconClass );
				
				el.removeClass( me.collapsedClass );
				body.show();
			}
			
		},
		/**
		 * @method legendBindings
		 * @return {Object}
		 */
		legendBindings: function() {
			return {};
		},
		/**
		 * @method legendTextBindings
		 * @return {Object}
		 */
		legendTextBindings: function() {
			var me = this,
				obj = {
					css: {},
					attr: {},
					text: me.textBind( "title" )
				};
			return obj;
		},
		/**
		 * @method collapsibleBindings
		 * @return {Object}
		 */
		collapsibleBindings: function() {
			var me = this,
				obj = {
					css: {
						"'fb-ui-collapsed-icon'": true
					}
				};
			
			obj.css.glyphicon = true;
			if ( me.collapsed ) {
				obj.css[ me.parseBind( me.expandIconClass ) ] = true;
			} else {
				obj.css[ me.parseBind( me.collapseIconClass ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method collapsibleLinkBindings
		 * @return {Object}
		 */
		collapsibleLinkBindings: function() {
			var me = this,
				obj = {
					attr: {
						"'data-collapse'": me.parseBind( me.getId() )
					}
				};
			return obj;
		},
		/**
		 * @method contentBindings
		 * @return {Object}
		 */
		contentBindings: function() {
			var me = this,
				obj = {
					css: {
						collapsed: me.collapsed
					}
				};
			
			obj.css[ me.parseBind( me.fieldsetBodyClass ) ] = true;
			
			return obj;
		}
	});
});


define('text!Firebrick.ui/containers/Form.html',[],function () { return '<form id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{=it.getItems()}}\r\n</form>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Form
 */
define( 'Firebrick.ui/containers/Form',[ "text!./Form.html", "jquery", "./Base" ], function( tpl, $ ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Form", {
		extend: "Firebrick.ui.containers.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.form",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @property formRole
		 * @type {String}
		 * @default "'form'"
		 */
		formRole: "form",
		/**
		 * controls the css class form-horizontal
		 * @property horizontal
		 * @type {Boolean|String}
		 * @default true
		 */
		horizontal: true,
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String|Function}
		 * @default ""
		 */
		html: "",
		/**
		 * controls the css class form-inline
		 * @property inline
		 * @type {Boolean|String}
		 * @default false
		 */
		inline: false,
		/**
		 * multipart/form-data for files
		 * @property enctype
		 * @type {String}
		 * @default "application/x-www-form-urlencoded"
		 */
		enctype: "application/x-www-form-urlencoded",
		/**
		 * whether the progress bar should be shown on form submission
		 * @property showProgress
		 * @type {Boolean}
		 * @default true
		 */
		showProgress: true,
		/**
		 * see "ProcessData" in http://api.jquery.com/jquery.ajax/
		 * @property ajaxProcessData
		 * @type {Boolean}
		 * @default true
		 */
		ajaxProcessData: false,
		/**
		 * used for submitting the form
		 * @property url
		 * @type {String}
		 * @default ""
		 */
		url: "/",
		/**
		 * @property submitType
		 * @type {String}
		 * @default "post"
		 */
		submitType: "post",
		/**
		 * set to true is you want the progress the upload/download progress to be caught
		 * when true, use myForm.addListener("progressChanged", function(percentComplete){}); to catch the value
		 * @property catchProgress
		 * @type {Boolean}
		 * @default false
		 */
		catchProgress: false,
		/**
		 * this is called before the form is submitted, use this
		 * return false to stop the submit function being called;
		 * @method preSubmit
		 * @param jquery "submit" event arguments
		 */
		preSubmit: function( event ) {
			event.preventDefault();
		},
		/**
		 * set the target attribute on the form
		 * @property formTarget
		 * @type {String}
		 * @default null
		 */
		formTarget: null,
		/**
		 * upload and download progress
		 * @event progressChanged
		 * @property xhr
		 * @type {Function}
		 */
		xhr: function() {
			var me = this,
				xhr = new window.XMLHttpRequest();

			//Upload progress
			xhr.upload.addEventListener( "progress", function( evt ) {
				if ( evt.lengthComputable ) {
					var percentComplete = evt.loaded / evt.total;
					if ( me.catchProgress ) {
						//fire the percentCompleted
						me.fireEvent( "progressChanged", percentComplete );
					}
				}
			}, false );

			//Download progress
			xhr.addEventListener( "progress", function( evt ) {
				if ( evt.lengthComputable ) {
					var percentComplete = evt.loaded / evt.total;
					if ( me.catchProgress ) {
						//fire the percentCompleted
						me.fireEvent( "progressChanged", percentComplete );
					}
				}
			}, false );

			return xhr;
		},
		/**
		 * method called on submit ajax
		 * @property success
		 * @type {Function}
		 * @default
		 */
		success: function() {
			console.info( "success", arguments );
		},
		/**
		 * method called on submit ajax
		 * @property error
		 * @type {Function}
		 * @default
		 */
		error: function() {
			console.warn( "error", arguments );
		},
		/**
		 * method called on submit ajax
		 * @property complete
		 * @type {Function}
		 * @default function(){}
		 */
		complete: function() {},
		/**
		 * method called after ajax
		 * @method always
		 * @param {Arguments} always function arguments from ajax
		 */
		always: function() {},
		/**
		 * method called after ajax
		 * @method beforeSend
		 * @param {Arguments} beforeSend function arguments from ajax
		 */
		beforeSend: function() {},
		/**
		 * this function requires the HTML5 function FormData to be supported
		 * @method getFormData
		 * @return {Object}
		 */
		getFormData: function() {
			var me = this;
			return new window.FormData( me.getElement() );
		},
		/**
		 * @method init
		 */
		init: function() {
			var me = this;
				
			me.on( "rendered", function() {
				var el = me.getElement();
				if ( el ) {
					el.on( "submit", function( ) {	//arg: event
						if ( me.preSubmit.apply( me, arguments ) !== false ) {
							me.submit();
						}
					});
				}
			});
			
			return me.callParent( arguments );
		},
		/**
		 * make sure this.url is set before calling this function
		 * @method submit
		 */
		submit: function() {
			var me = this,
				form = me.getElement();

			if ( !me.url || typeof me.url !== "string" ) {
				console.error( "unable to submit form. No url is set or is set incorrectly", me.url, me );
				return;
			}
			
			if ( !form ) {
				console.error( "unable to submit form. Form not found for id", me.getId() );
				return;
			}

			if ( window.FormData ) {
				//HTML 5 - IE10+
				$.ajax({
					xhr: me.xhr,
					url: me.url,
					type: me.submitType,
					data: new window.FormData( form[ 0 ] ),
					processData: me.ajaxProcessData,
					contentType: me.enctype,
					beforeSend: me.beforeSend.bind( me ),
					complete: me.complete.bind( me ), //regardless of success of failure
					success: me.success.bind( me ),
					error: me.error.bind( me )
				}).always( me.always.bind( me ) );
			} else {
				console.error( "FormData is not supported by your browser" );
			}
		},
		/**
		 * @method formBindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.attr.role =  me.parseBind( me.formRole );
			obj.attr.enctype =  me.parseBind( me.enctype );
			obj.css[ "'form-horizontal'" ] =  me.horizontal;
			obj.css[ "'form-inline'" ] =  me.inline;
			obj.attr.action = "Firebrick.getById('" + me.getId() + "').url";
			obj.attr.method = me.parseBind( me.submitType );
			
			if ( me.formTarget ) {
				obj.attr.target = me.parseBind( me.formTarget );
			}
			
			if ( !me.items ) {
				obj.html = "Firebrick.ui.helper.getHtml( '" + me.getId() + "', $data, $context )";
			}
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class FormPanel
 */
define( 'Firebrick.ui/containers/FormPanel',[ "./Panel", "./Form" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.FormPanel", {
		extend: "Firebrick.ui.containers.Panel",
		/**
		 * @property sName
		 * @type {String}
		 * @default "containers.formpanel"
		 */
		sName: "containers.formpanel",
		/**
		 * configuration to pass to the form section of the Panel
		 * @property formConfig
		 * @type {Object}
		 * @default null
		 */
		formConfig: null,
		/**
		 * @method build
		 * @private
		 */
		init: function() {
			var me = this,
				formItem = me.formConfig || {};
				
			formItem.sName = "containers.form";

			if ( me.items ) {
				formItem.items = me.items;
			} else {
				formItem.html = me.html;
			}
			
			me.items = [ formItem ];
			 
			return me.callParent( arguments );
		}
	});
});


define('text!Firebrick.ui/containers/Modal.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n  <div data-bind="{{=it.dataBind(\'dialogBindings\')}}">\r\n    <div data-bind="{{=it.dataBind(\'contentBindings\')}}">\r\n      <div data-bind="{{=it.dataBind(\'headerBindings\')}}">\r\n      \t{{?it.showCloseIcon}}\r\n      \t\t<button data-bind="{{=it.dataBind(\'closeButtonBindings\')}}"><span aria-hidden="true">&times;</span><span data-bind="{{=it.dataBind(\'srCloseIconBindings\')}}"></span></button>\r\n      \t{{?}}\r\n        <h{{=it.titleSize}} id="{{=it.getTitleId()}}" data-bind="{{=it.dataBind(\'titleBindings\')}}"></h{{=it.titleSize}}>\r\n      </div>\r\n      <div data-bind="{{=it.dataBind(\'bodyBindings\')}}">\r\n        {{=it.getItems()}}\r\n      </div>\r\n      {{?it.footerItems}}\r\n\t      <div data-bind="{{=it.dataBind(\'footerBindings\')}}">\r\n\t      \t{{=it.getItemsProp(\'footerItems\')}}\r\n\t      </div>\r\n      {{?}}\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Modal
 */
define( 'Firebrick.ui/containers/Modal',[ "text!./Modal.html", "./Base" ], function( tpl ) {
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.containers.Modal", {
		extend: "Firebrick.ui.containers.Base",
		tpl: tpl,
		target: "body",
		appendTarget: true,
		sName: "containers.modal",
		init: function() {
			var me = this;
			me.on( "rendered", function() {
				if ( me.showOnCreate ) {
					me.showMe();
				}
				me.getElement().on( "hidden.bs.modal", function() {
					me.destroy();
				});
			});
			return me.callParent( arguments );
		},
		enclosedBind: true,
		/**
		 * @property _modalEl
		 * @private
		 * @type {jQuery Object}
		 * @default null
		 */
		_modalEl: null,
		/**
		 * @method getModalEl
		 * @return {jQuery Object}
		 */
		getModalEl: function() {
			var me = this;
			if ( !me._modalEl ) {
				me._modalEl = $( "> .modal", me.getElement() );
			}
			return me._modalEl;
		},
		/**
		 * show the modal
		 * @method showMe
		 * @return {Object} self
		 */
		showMe: function() {
			var me = this;
			me.getModalEl().modal();
		},
		/**
		 * @property ariaDescribedBy
		 * @type {String}
		 * @default ""
		 */
		ariaDescribedBy: "",
		/**
		 * if true - the modal will popup after .create() has been called
		 * @property showOnCreate
		 * @type {Boolean}
		 * @default false
		 */
		showOnCreate: true,
		/**
		 * @property title
		 * @type {String}
		 * @default ""
		 */
		title: "",
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String|Function}
		 * @default ""
		 */
		html: "",
		/**
		 * @property titleClass
		 * @type {Boolean}
		 * @default true
		 */
		titleClass: true,
		/**
		 * @property bodyClass
		 * @type {Boolean}
		 * @default true
		 */
		bodyClass: true,
		/**
		 * @property animationClass
		 * @type {String}
		 * @default "fade"
		 */
		animationClass: "fade",
		/**
		 * @property dialogClass
		 * @type {Boolean}
		 * @default true
		 */
		dialogClass: true,
		/**
		 * @property contentClass
		 * @type {Boolean}
		 * @default true
		 */
		contentClass: true,
		/**
		 * @property headerClass
		 * @type {Boolean}
		 * @default true
		 */
		headerClass: true,
		/**
		 * @property isModal
		 * @type {Boolean}
		 * @default true
		 */
		isModal: true,
		/**
		 * @property footerClass
		 * @type {Boolean}
		 * @default true
		 */
		footerClass: true,
		/**
		 * @property footerItems
		 * @type {Array of Objects}
		 * @default null
		 */
		footerItems: null,
		/**
		 * used to created the <h{int}></h{int}> tags in the header
		 * @property titleSize
		 * @type {Integer}
		 * @default 4
		 */
		titleSize: 4,
		/**
		 * @property showCloseIcon
		 * @type {Boolean}
		 * @default true
		 */
		showCloseIcon: true,
		/**
		 * screen reader text
		 * @property srCloseText
		 * @type {String}
		 * @default "Close"
		 */
		srCloseText: "Close",
		/**
		 * @method srCloseIconBindings
		 * @return {Object}
		 */
		srCloseIconBindings: function() {
			var me = this;
			return {
				css: {
					"'sr-only'": true
				},
				text: me.parseBind( me.srCloseText )
			};
		},
		/**
		 * @method closeButtonBindings
		 * @return {Object}
		 */
		closeButtonBindings: function() {
			return {
				attr: {
					type: "'button'",
					"'data-dismiss'": "'modal'"
				},
				css: {
					close: true
				}
			};
		},
		/**
		 * @method getTitleId
		 * @return {String}
		 */
		getTitleId: function() {
			return "fb-modal-title-" + this.getId();
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = this.callParent();
			
			obj.css.modal = me.isModal;
			
			obj.attr[ "'aria-labelledby'" ] = me.parseBind( me.getTitleId() );
			obj.attr[ "'aria-describedby'" ] = me.parseBind( me.ariaDescribedBy );
			obj.attr.role = "'dialog'";
			obj.attr.tabindex = -1;
			obj.attr[ "'aria-hidden'" ] = true;
			
			if ( me.animationClass ) {
				obj.css[ me.animationClass ] = true;
			}
			
			return obj;
		},
		/**
		 * @method dialogBindings
		 * @return {Object}
		 */
		dialogBindings: function() {
			var me = this;
			return {
				css: {
					"'modal-dialog'": me.dialogClass
				}
			};
		},
		/**
		 * @method contentBindings
		 * @return {Object}
		 */
		contentBindings: function() {
			var me = this;
			return {
				css: {
					"'modal-content'": me.contentClass
				}
			};
		},
		/**
		 * @method headerBindings
		 * @return {Object}
		 */
		headerBindings: function() {
			var me = this;
			return {
				css: {
					"'modal-header'": me.headerClass
				}
			};
		},
		/**
		 * @method titleBindings
		 * @return {Object}
		 */
		titleBindings: function() {
			var me = this;
			return {
				text: me.textBind( "title" ),
				css: {
					"'modal-title'": me.titleClass
				}
			};
		},
		/**
		 * @method bodyBindings
		 * @return {Object}
		 */
		bodyBindings: function() {
			var me = this,
				obj = {
					css: {
						"'modal-body'": me.bodyClass
					}
				};
			
			if ( !me.items ) {
				obj.html = "Firebrick.ui.helper.getHtml( '" + me.getId() + "', $data, $context )";
			}
			
			return obj;
		},
		/**
		 * @method footerBindings
		 * @return {Object}
		 */
		footerBindings: function() {
			var me = this;
			return {
				css: {
					"'modal-footer'": me.footerClass
				}
			};
		},
		/**
		 * close modal
		 * @method close
		 */
		close: function() {
			var me = this;
			me.getModalEl().modal( "hide" );
		}
	});
	
});


define('text!Firebrick.ui/containers/tab/Pane.html',[],function () { return '<div data-bind="{{=it.dataBind()}}">\r\n\t{{=it.getItems()}}\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 *
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers.tab
 * @class Pane
 */
define( 'Firebrick.ui/containers/tab/Pane',[ "text!./Pane.html", "../Base", "bootstrap.plugins/tab" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.tab.Pane", {
		extend: "Firebrick.ui.containers.Base",
		tpl: tpl,
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-tab.pane"
		 */
		sName: "containers.tab.pane",
		/**
		 * @property active
		 * @type {Boolean}
		 * @default false
		 */
		active: false,
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String|Function}
		 * @default ""
		 */
		html: "",
		/**
		 * returns the Tab component, not the TabPane!
		 * @method getTabId
		 * @return {String}
		 */
		getTab: function() {
			return this._parent;
		},
		/**
		 * set by tab
		 * @property paneIndex
		 * @type {integer}
		 * @default 0
		 */
		paneIndex: 0,
		/**
		 * @method getPaneId
		 * @return {String}
		 */
		getPaneId: function() {
			var me = this,
				parent = me.getTab();
			
			return parent.getTabId( me.paneIndex );
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent();
		
			obj.attr.role = "'tabpanel'";
			obj.css[ "'tab-pane'" ] = true;
			obj.css.active = me.active;
			
			obj.attr.id = "Firebrick.getById('" + me.getId() + "').getPaneId()";

			if ( !me.items ) {
				obj.html = "Firebrick.ui.helper.getHtml( '" + me.getId() + "', $data, $context )";
			}
			
			return obj;
		}
	});
});


define('text!Firebrick.ui/containers/TabPanel.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\r\n\t<ul data-bind="{{=it.dataBind(\'listBindings\')}}">\r\n\t\t<!-- ko {{=it.dataBind(\'listTemplateBindings\')}} --><!-- /ko -->\r\n\t</ul>\r\n\t\r\n\t<div data-bind="{{=it.dataBind(\'tabContentBindings\')}}">\r\n\t\t{{~ it.items :value:index}}\r\n\t\t\t{{=it.getTabPaneItem(index, value)}}\r\n\t\t{{~}}\r\n\t</div>\r\n\t\r\n\t<script type="text/html" id="{{=it._getListTplId()}}">\r\n\t\t<li data-bind="{{=it.dataBind(\'listItemBindings\')}}"><a data-bind="{{=it.dataBind(\'listItemLinkBindings\')}}"><span data-bind="{{=it.dataBind(\'listItemTextBindings\')}}"></span></a></li>\r\n\t</script>\r\n\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class TabPanel
 */
define( 'Firebrick.ui/containers/TabPanel',[ "text!./TabPanel.html", "./Base", "bootstrap.plugins/tab", "./tab/Pane" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.TabPanel", {
		extend: "Firebrick.ui.containers.Base",
		tpl: tpl,
		/**
		* @property sName
		* @type {String}
		* @default "fb-ui-tabpanel"
		*/
		sName: "containers.tabpanel",
		/**
		 * @private
		 * @method _getListTplId
		 * @return {String}
		 */
		_getListTplId: function() {
			return "fb-ui-tpl-list-" + this.getId();
		},
		/**
		 * @private
		 * @method _getTabPaneTplId
		 * @return {String}
		 */
		_getTabPaneTplId: function() {
			return "fb-ui-tpl-tabpane-" + this.getId();
		},
		/**
		 * @property _tabs
		 * @private
		 * @type {Array}
		 * @default null
		 */
		_tabs: null,
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {
				sName: "containers.tab.pane"
			}
		 */
		defaults: {
			sName: "containers.tab.pane"
		},
		/**
		 * @method init
		 * @return self
		 */
		init: function() {
			var me = this;
			this._firstTabActive();
			return me.callParent( arguments );
		},
		/**
		 * check if any tab has been set as active, if not, set the first tab active as default
		 * @method _firstTabActive
		 * @return self
		 */
		_firstTabActive: function() {
			var me = this,
			it,
			active = false,
			length = me.items.length;
		
			for ( var i = 0; i < length; i++ ) {
				it = me.items[ i ];
				if ( it.active ) {
					active = true;
					break;
				}
			}
			
			if ( !active && length ) {
				//force first tab to be active
				me.items[ 0 ].active = true;
			}
			return me;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent();
			
			obj.attr.role = "'tabpanel'";
			
			return obj;
		},
		/**
		 * @method listTemplateBindings
		 * @return {Object}
		 */
		listTemplateBindings: function() {
			var me = this,
				obj = {};
			
			obj.template = {
					name: me.parseBind( me._getListTplId() ),
					foreach: Firebrick.ui.helper.tabBuilder( me.getId() ),
					as: "'tab'"
			};
			
			return obj;
		},
		/**
		 * @method listBindings
		 * @return {Object}
		 */
		listBindings: function() {
			var obj = { css: {}, attr: {} };
			
			obj.attr.role = "'tablist'";
			obj.css.nav = true;
			obj.css[ "'nav-tabs'" ] = true;
			
			return obj;
		},
		/**
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function() {
			var obj = { css: {}, attr: {} };
			
			obj.attr.role = "'presentation'";
			obj.css.active = "tab.hasOwnProperty('active') ? tab.active : false";
			obj.css.disabled = "tab.disabled";
			
			return obj;
		},
		/**
		 * @method listItemLinkBindings
		 * @return {Object}
		 */
		listItemLinkBindings: function() {
			var me = this,
				obj = { css: {}, attr: {} };
			
			obj.attr.href = "Firebrick.ui.helper.linkBuilder(tab)";
			obj.attr[ "'aria-controls'" ] = "tab.id";
			obj.attr[ "'data-target'" ] = "Firebrick.getById('" + me.getId() + "').registerTab(tab.id, $index)";
			obj.attr.role = "'tab'";
			obj.attr[ "'data-toggle'" ] = "tab.disabled !== true ? 'tab' : false";
			
			return obj;
		},
		/**
		 * @method listItemTextBindings
		 * @return {Object}
		 */
		listItemTextBindings: function() {
			var me = this,
				obj = { css: {}, attr: {} };
			
			obj.text = "Firebrick.text( tab.title )";
			
			return obj;
		},
		
		/**
		 * @method tabContentBindings
		 * @return {Object}
		 */
		tabContentBindings: function() {
			var obj = { css: {}, attr: {} };
			
			obj.css[ "'tab-content'" ] = true;
			
			return obj;
		},
		
		/**
		 * @method registerTab
		 * @param tabId {String} optional - generates one if not supplied
		 * @param index {Integer}
		 * @return "#{id}"
		 */
		registerTab: function( tabId, index ) {
			var me = this,
				id;
			
			if ( $.isFunction( index ) ) {
				index = index();
			}
			
			id = tabId || "fb-ui-tab-" + me.getId() + "-" + index;
			
			me.addTab( id );
			
			return "#" + id;
		},
		
		/**
		 * @method addTab
		 * @param id {String}
		 * @return self
		 */
		addTab: function( id ) {
			var me = this;
			if ( !me._tabs ) {
				me._tabs = [];
			}
			me._tabs.push( id );
			return me;
		},
		
		/**
		 * returns tab id at index position
		 * @method getTabId
		 * @param index {Integer}
		 * @return {String}
		 */
		getTabId: function( index ) {
			return this._tabs[ index ];
		},
		
		/**
		 * used when calling {{{getTabPaneItem}}} in template
		 * @method getTabPaneItem
		 * @param {Int} iteration index
		 * @param {Object} iteration object
		 * @param {Context} iteration context
		 * @return {String}
		 */
		getTabPaneItem: function( index, item ) {
			var me = this,
				newItem;
			
			item.paneIndex = index;
			
			newItem = me._getItems( item );
			
			if ( newItem ) {
				//replace items with the new object - _getItems returns an object {html:"", items:[]}
				me.items[ index ] = newItem.items[ 0 ];
				
				return newItem.html;
			}
			return "";
		}
	});
});


define('text!Firebrick.ui/display/Alert.html',[],function () { return '<div data-bind="{{=it.dataBind()}}">\r\n\t{{?it.dismissible}}\r\n      <button data-bind="{{=it.dataBind(\'closeButtonBindings\')}}"><span aria-hidden="true">&times;</span><span data-bind="{{=it.dataBind(\'srCloseIconBindings\')}}"></span></button>\r\n    {{?}}\r\n    {{?!it.items}}\r\n    \t{{?it.title}}\r\n    \t<h4>{{=Firebrick.text(it.title)}}</h4>\r\n    \t{{?}}\r\n    \t<p data-bind="{{=it.dataBind(\'paragraphBindings\')}}">\r\n    \t</p>\r\n    {{?? true }}\r\n    \t{{=it.getItems()}}\r\n    {{?}}\r\n\t\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @uses components.common.mixins.Items
 * @class Alert
 */
define( 'Firebrick.ui/display/Alert',[ "text!./Alert.html", "../common/Base", "../common/mixins/Items" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Alert", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Items",
		tpl: tpl,
		sName: "display.alert",
		/**
		 * whether the alert is dismissible - also controls whether the X button is shown or not
		 * @property dismissible
		 * @type {Boolean}
		 * @default true
		 */
		dismissible: true,
		/**
		 * @property animationClasses
		 * @type {String|false}
		 * @default "fade in"
		 */
		animationClasses: "fade in",
		/**
		 * alert type, "danger", "info", "warn" etc
		 * @property type
		 * @type {String}
		 * @default "danger"
		 */
		type: "danger",
		/**
		 * if set, .items will be ignored
		 * @property title
		 * @type {String}
		 * @default ""
		 */
		title: "",
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String}
		 * @default ""
		 */
		html: "",
		/**
		 * fill the panel body with text
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text: "",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.attr.role = "'alert'";
			obj.css.alert = true;
			obj.css[ "'alert-dismissible'" ] = me.dismissible;
			if ( me.animationClasses ) {
				obj.css[ me.parseBind( me.animationClasses ) ] = true;
			}
			obj.css[ me.parseBind( "alert-" + me.type ) ] = true;
			
			return obj;
		},
		/**
		 * @method paragraphBindings
		 * @return {Object}
		 */
		paragraphBindings: function() {
			var me = this,
				id = me.getId(),
				obj = {};
			
			if ( me.text ) {
				obj.text = "Firebrick.text( Firebrick.getById('" + id + "').text )";
			} else {
				obj.html = "Firebrick.getById('" + id + "').html";
			}
			
			return obj;
		},
		
		/**
		 * screen reader text
		 * @property srCloseText
		 * @type {String}
		 * @default "Close"
		 */
		srCloseText: "Close",
		/**
		 * @method srCloseIconBindings
		 * @return {Object}
		 */
		srCloseIconBindings: function() {
			var me = this;
			return {
				css: {
					"'sr-only'": true
				},
				text: me.parseBind( me.srCloseText )
			};
		},
		/**
		 * @method closeButtonBindings
		 * @return {Object}
		 */
		closeButtonBindings: function() {
			return {
				attr: {
					type: "'button'",
					"'data-dismiss'": "'alert'"
				},
				css: {
					close: true
				}
			};
		}
	});
});


define('text!Firebrick.ui/display/Divider.html',[],function () { return '<hr data-bind="{{=it.dataBind()}}" />';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Divider
 */
define( 'Firebrick.ui/display/Divider',[ "text!./Divider.html", "../common/Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Divider", {
		extend: "Firebrick.ui.common.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "display.divider",
		/**
		 * @property tpl
		 * @type {html}
		 */
		tpl: tpl
	});
});


define('text!Firebrick.ui/display/Header.html',[],function () { return '<h{{=it.headerSize}} id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t{{?it.href}}\r\n\t\t<a href="{{=it.href}}" data-bind="{{=it.dataBind(\'hrefBindings\')}}">\r\n\t{{?}}\r\n\t<span data-bind="{{=it.dataBind(\'textBindings\')}}"></span>\r\n\t<small data-bind="{{=it.dataBind(\'secondaryTextBindings\')}}"></small>\r\n\t{{=it.getLabelTpl()}}\r\n\t{{?it.href}}\r\n\t\t</a>\r\n\t{{?}}\r\n</h{{=it.headerSize}}>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Header
 */
define( 'Firebrick.ui/display/Header',[ "text!./Header.html", "../common/Base", "../common/mixins/Label" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Header", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Label",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "display.header",
		/**
		 * @property tpl
		 * @type {String}
		 */
		tpl: tpl,
		/**
		 * use to determine whether h1, h2, h3 etc - default = 1
		 * @property headerSize
		 * @type {Int}
		 * @default 1
		 */
		headerSize: 1,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text: "",
		/**
		 * @property secondaryText
		 * @type {String}
		 * @default ""
		 */
		secondaryText: "",
		/**
		 * change to a url if you wish to convert the header into a link
		 * @property href
		 * @type {String}
		 * @default null
		 */
		href: null,
		/**
		 * set to true to add attribute [fb-ignore-router=true] to all links - these links are then ignored by the history api (Firebrick.router.history)
		 * @property ignoreRouter
		 * @type {Boolean}
		 * @default true
		 */
		ignoreRouter: true,
		/**
		 * @method textBindings
		 * @return Object
		 */
		textBindings: function() {
			var me = this,
				obj = {};
			
			obj.text = me.textBind( "text" );
			
			return obj;
		},
		/**
		 * @method secondaryTextBindings
		 * @return Object
		 */
		secondaryTextBindings: function() {
			var me = this;
			if ( me.secondaryText ) {
				return {
					text: me.textBind( "secondaryText" )
				};
			} else {
				return {
					visible: false
				};
			}
		},
		/**
		 * @method hrefBindings
		 * @return {Object}
		 */
		hrefBindings: function() {
			var me = this,
				obj = { attr: {} };
			obj.attr[ "'fb-ignore-router'" ] = "$data.hasOwnProperty( 'ignoreRouter' ) ? $data.ignoreRouter : " + me.ignoreRouter;
			return obj;
		}
		
	});
});


define('text!Firebrick.ui/display/Image.html',[],function () { return '<img id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}" />';});

/*!
* @author Steven Masala [me@smasala.com]
*/

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Image
 */
define( 'Firebrick.ui/display/Image',[ "text!./Image.html", "../common/Base", "responsive-images" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Image", {
		extend: "Firebrick.ui.common.Base",
		sName: "display.image",
		tpl: tpl,
		/**
		 * @method init
		 */
		init: function() {
			var me = this;
			me.on( "rendered", function() {
				if ( window.responsiveImages ) {
					window.responsiveImages.update( me.getId() );
				}
			});
			this.callParent( arguments );
		},
		/**
		 * @property src
		 * @type {String}
		 * @default ""
		 */
		src: "",
		/**
		 * use this property for responsive images. Define in order of sizes with the largest first!
		 * @example "xl, l, m, s, xs"
		 * @property sizes
		 * @type {String} predefined sizes or media queries
		 * @default ""
		 */
		sizes: "",
		/**
		 * use this property in conjunction with "sizes" - mirror the image sizes with that of the "sizes" order
		 * @example "dogXL.jpg, dogL.jpg, dogM.jpg, dogS.jpg, dogXS.jpg"
		 * @property srcset
		 * @type {String} url(s)
		 * @default ""
		 */
		srcset: "",
		/**
		 * sets "img-responsive" to the image
		 * @property responsiveClass
		 * @type {Boolean}
		 * @default true
		 */
		responsiveClass: true,
		/**
		 * "rounded, "circle", "thumbnail"
		 * @property imgType
		 * @type {String|Boolean}
		 * @default "rounded"
		 */
		imgType: "rounded",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'img-responsive'" ] = me.responsiveClass;

			if ( me.imgType ) {
				obj.css[ me.parseBind( "img-" + me.imgType ) ] = true;
			}
			
			if ( me.sizes ) {
				obj.attr[ "'data-sizes'" ] = me.sizes;
			}
			
			if ( me.srcset ) {
				obj.attr[ "'data-srcset'" ] = me.srcset;
			}
			
			if ( me.src ) {
				obj.attr.src = me.src;
			}
			
			return obj;
		}
	});
});


define('text!Firebrick.ui/display/Loader.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t<div data-bind="{{=it.dataBind(\'maskBindings\')}}"></div>\r\n\t<div data-bind="{{=it.dataBind(\'msgContainerBindings\')}}">\r\n\t\t<span data-bind="{{=it.dataBind(\'spinnerBindings\')}}"></span>\r\n\t\t<span data-bind="{{=it.dataBind(\'msgBindings\')}}"></span>\r\n\t</div>\t\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @uses components.common.mixins.Items
 * @class Loader
 */
define( 'Firebrick.ui/display/Loader',[ "text!./Loader.html", "jquery", "../common/Base", "../common/mixins/Items" ], function( tpl, $ ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Loader", {
		extend: "Firebrick.ui.common.Base",
		enclosedBind: true,
		/**
		 * @property target
		 * @type {String or jQuery Object}
		 * @default "body"
		 */
		target: "body",
		/**
		 * @property appendTarget
		 * @type {Boolean}
		 * @default true
		 */
		appendTarget: true,
		/**
		 * @property mixins
		 * @private
		 * @default "Firebrick.ui.common.mixins.Items"
		 */
		mixins: "Firebrick.ui.common.mixins.Items",
		/**
		 * @property tpl
		 * @type {String HTML}
		 * @default Loader.html
		 */
		tpl: tpl,
		/**
		 * @property sName
		 * @type {String}
		 * @default "display.loader",
		 */
		sName: "display.loader",
		/**
		 * @property msgText
		 * @type {String}
		 * @default "Please wait..."
		 */
		msgText: "Please wait...",
		/**
		 * @method init
		 */
		init: function() {
			var me = this,
				target = me.getTarget();
			
			if ( target.is( "input" ) ) {
				me.target = target.parent();
			}
			
			me.on( "rendered", function() {
				me._initRender();
			});
			return me.callParent( arguments );
		},
		/**
		 * @method _initRender
		 * @private
		 */
		_initRender: function() {
			var me = this,
				target = me.getTarget();
			
			target.addClass( "fb-ui-loader-open" ); //TODO: if target is absolute or fixed?
			me.position();
		},
		/**
		 * @method destroy
		 */
		destroy: function() {
			var me = this,
				target = me.getTarget();
			target.removeClass( "fb-ui-loader-open" );
			return me.callParent( arguments );
		},
		/**
		 * @method _getCalcTarget
		 * @return {jQuery Object}
		 */
		_getCalcTarget: function() {
			var me = this;
			return me.target === "body" || me.target === "html" ? $( window ) : me.getTarget();
		},
		/**
		 * positions loader
		 * @method position
		 */
		position: function() {
			var me = this,
				$target = me._getCalcTarget(),
				$el = me.getElement(),
				$loader = $( ".fb-ui-loader-msg-container", $el ),
				xPos = $loader.outerWidth() / 2,
				yPos = $loader.outerHeight() / 2;

			$loader.css({
				top: ( $target.height() / 2 ) - yPos,
				left: ( $target.width() / 2 ) - xPos
			});
			
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'fb-ui-loader-container'" ] = true;
			
			return obj;
		},
		/**
		 * @method maskBindings
		 * @return {Object}
		 */
		maskBindings: function() {
			var obj = {
					css: {
						"'fb-ui-loader-mask'": true
					}
				};
			return obj;
		},
		/**
		 * @method spinnerBindings
		 * @return {Object}
		 */
		spinnerBindings: function() {
			var obj = {
					css: {
						"'fb-ui-loader-spinner'": true,
						glyphicon: true,
						"'glyphicon-refresh'": true,
						"'glyphicon-refresh-animate'": true
					}
				};
			return obj;
		},
		/**
		 * @method msgContainerBindings
		 * @return {Object}
		 */
		msgContainerBindings: function() {
			var obj = {
					css: {
						"'fb-ui-loader-msg-container'": true
					}
				};
			
			return obj;
		},
		/**
		 * @method msgBindings
		 * @return {Object}
		 */
		msgBindings: function() {
			var me = this,
				obj = {
					css: {
						"'fb-ui-loader-msg'": true
					}
				};
			
			if ( me.msgText ) {
				obj.text = me.textBind( "msgText" );
			}
			
			return obj;
		}
	});
});


define('text!Firebrick.ui/display/Progress.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind(\'progressContainerBindings\')}}">\r\n\t{{?it.showLabel}}\r\n\t\t<p data-bind="{{=it.dataBind(\'progressLabelBindings\')}}" ></p>\r\n\t{{?}}\r\n\t<progress data-bind="{{=it.dataBind()}}"></progress>\r\n</div>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Progress
 */
define( 'Firebrick.ui/display/Progress',[ "text!./Progress.html", "../common/Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Progress", {
		extend: "Firebrick.ui.common.Base",
		sName: "display.progress",
		tpl: tpl,
		/**
		 * progress html5 element max attribute
		 * @property max
		 * @type {Integer|String|Function}
		 * @default 100
		 */
		max: 100,
		/**
		 * progress html5 element value attribute
		 * @property value
		 * @type {Integer|String|Function} use a string or function for data binding
		 * @default 0
		 */
		value: 0,
		/**
		 * whether or not to show a label with the progress bar
		 * @property showLabel
		 * @type {Boolean}
		 * @default true
		 */
		showLabel: true,
		/**
		 * used to append to the data-value attribute value
		 * @property dataSymbol
		 * @type {String}
		 * @default "%"
		 */
		dataSymbol: "%",
		/**
		 * @property label
		 * @type {String}
		 * @default ""
		 */
		label: "",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.attr.max = me.max;
			obj.attr.value = me.value;
			obj.text = me.parseBind( me.value + "%" );
			
			return obj;
		},
		/**
		 * @method progressLabelBindings
		 */
		progressLabelBindings: function() {
			var me = this;
			return {
				css: {
					"'progress-label'": true
				},
				attr: {
					"'data-symbol'": me.parseBind( me.dataSymbol ),
					"'data-value'": me.value
				},
				text: me.textBind( "label" ),
				style: {
					width: me.parseBind( me.value + "%" )
				}
			};
		},
		/**
		 * @method progressContainerBindings
		 */
		progressContainerBindings: function() {
			return {
				css: {
					"'progress-container'": true
				}
			};
		}
	});
});


define('text!Firebrick.ui/display/Span.html',[],function () { return '<span id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}"></span>';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Span
 */
define( 'Firebrick.ui/display/Span',[ "text!./Span.html", "../common/Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Span", {
		extend: "Firebrick.ui.common.Base",
		sName: "display.span",
		tpl: tpl,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text: "",
		/**
		 * set as "primary", "default", "warning", "danger", "success", "info" to convert the span to a BS label component
		 * @property labelStyle
		 * @type {String}
		 * @default ""
		 */
		labelStyle: "",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.text = "Firebrick.getById('" + me.getId() + "').text";
			
			if ( me.labelStyle ) {
				me.css.label = true;
				me.css[ me.parseBind( "label-" + me.labelStyle ) ] = true;
			}
			
			return obj;
		}
	});
});


define('text!Firebrick.ui/display/Text.html',[],function () { return '{{?it.blockQuote}}\r\n<blockquote data-bind="{{=it.dataBind(\'blockQuoteBindings\')}}">\r\n{{?}}\r\n\t<p data-bind="{{=it.dataBind()}}">\r\n\t</p>\r\n\t{{?it.blockQuoteFooter}}\r\n\t<footer data-bind="{{=it.dataBind(\'blockQuoteFooterBindings\')}}"></footer>\r\n\t{{?}}\r\n{{?it.blockQuote}}\r\n</blockquote>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Text
 */
define( 'Firebrick.ui/display/Text',[ "text!./Text.html", "../common/Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Text", {
		extend: "Firebrick.ui.common.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "display.text",
		/**
		 * @property tpl
		 * @type {String}
		 */
		tpl: tpl,
		/**
		 * @property html
		 * @type {String}
		 * @default false
		 */
		html: false,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text: "",
		/**
		 * @property leadCSS
		 * @type {Boolean}
		 * @default false
		 */
		leadCSS: false,
		/**
		 * @property blockQuote
		 * @type {Boolean}
		 * @default false
		 */
		blockQuote: false,
		/**
		 * @property blockQuoteReverseCSS
		 * @type {Boolean}
		 * @default false
		 */
		blockQuoteReverseCSS: false,
		/**
		 * false not to show, string for footer text
		 * @property blockQuoteFooter
		 * @type {Boolean|String}
		 * @default false
		 */
		blockQuoteFooter: false,
		/**
		 * @property isBlockQuoteFooterHTML
		 * @type {Boolean}
		 * @default false
		 */
		isBlockQuoteFooterHTML: false,
		/**
		 * false || string :: 'left', 'center', 'right', 'justify', 'no-wrap' (defaults to: left)
		 * @property textAlignment
		 * @type {Boolean|String}
		 * @default ""
		 */
		textAlignment: "",
		/**
		 * Bindings
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css.lead = me.leadCSS;
			
			if ( me.textAlignment ) {
				obj.css[ me.parseBind( "text-" + me.textAlignment ) ] = true;
			}
			
			if ( me.isHtml ) {
				obj.html = "Firebrick.getById('" + me.getId() + "').html";
			} else if ( me.text ) {
				obj.text = me.textBind( "text" );
			}
			
			return obj;
		},
		/**
		 * @method blockQuoteBindings
		 * @return {Object}
		 */
		blockQuoteBindings: function() {
			return {
				css: {
					"'blockquote-reverse'": this.blockQuoteReverseCSS
				}
			};
		},
		/**
		 * @method blockQuoteFooterBindings
		 * @return {Object}
		 */
		blockQuoteFooterBindings: function() {
			var me = this,
				obj = {};
			if ( me.html ) {
				obj.html = "Firebrick.getById('" + me.getId() + "')['blockQuoteFooter']";
			} else {
				obj.text = me.textBind( "blockQuoteFooter" );
			}
			return obj;
		}
	});
});


define('text!Firebrick.ui/fields/Radio.html',[],function () { return '{{?it.showOptionLabel}}\r\n<label data-bind="{{=it.dataBind(\'optionLabelContainerBindings\')}}">\r\n{{?}}\r\n\t{{=it.getParentSubTpl()}}\r\n{{?it.showOptionLabel}}\r\n\t<span data-bind="{{=it.dataBind(\'optionLabelBindings\')}}"></span>\r\n</label>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.MultiplesBase
 * @namespace components.fields
 * @class Radio
 */
define( 'Firebrick.ui/fields/Radio',[ "text!./Radio.html", "../common/MultiplesBase" ], function( subTpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Radio", {
		extend: "Firebrick.ui.common.MultiplesBase",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.radio",
		/**
		 * @property type
		 * @type {String}
		 * @default "'radio'"
		 */
		type: "radio",
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'radiolist'"
		 */
		dataType: "radiolist",
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl: subTpl,
		/**
		 * @property showOptionLabel
		 * @type {Boolean}
		 * @default true
		 */
		showOptionLabel: true,
		/**
		 * radio options
		 * @property options
		 * @type {Boolean|String}
		 * @default false
		 */
		options: false,
		/**
		 * @property optionsPropValue
		 * @type {String}
		 * @default "value"
		 */
		optionsPropValue: "value",
		/**
		 * @property optionsPropText
		 * @type {String}
		 * @default "text"
		 */
		optionsPropText: "text",
		/**
		 * @method optionLabelBindings
		 * @return {Object}
		 */
		optionLabelBindings: function() {
			var me = this;
			if ( !me.inplaceEdit ) {
				return {
					text: "$data.text ? Firebrick.text($data.text) : ''"
				};
			}
			return {};
		},
		
		/**
		 * @method optionLabelContainerBindings
		 * @return {Object}
		 */
		optionLabelContainerBindings: function() {
			var me = this;
			return {
				attr: {
					"for": me.inplaceEdit ?  me.parseBind( me.getId() ) : "itemId"
				}
			};
		},
		/**
		 * @method inputContainerBindings
		 * @return {Object}
		 */
		inputContainerBindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( me.options && !me.inplaceEdit ) {
				obj.foreach = Firebrick.ui.helper.optionString( me );
			}
			
			obj.attr = obj.attr || {};
			obj.attr.id = me.parseBind( me.getId() );
			
			return obj;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments ),
				value = me.value || null;
			
			if ( $.isPlainObject( value ) && value.value ) {
				if ( $.isFunction( value.value ) ) {
					value = value.value();
				} else {
					value = value.value;
				}
			}
			
			if ( me.inplaceEdit ) {
				obj.editable = me.selectedOptions || false;
				obj.editableOptions = {
						optionsValue: me.parseBind( me.optionsPropValue ),
						optionsText: me.parseBind( me.optionsPropText ),
						options: Firebrick.ui.helper.optionString( me ),
						type: "'checklist'"
				};
			}
			
			obj.css[ "'form-control'" ] = false;
			if ( !me.inplaceEdit ) {
				obj.value = "$data.value ? $data.value : $data";
				obj.attr.id = "itemId";
			} else {
				obj.attr.id =  me.parseBind( me.getId() );
			}
			obj.attr.name = me.parseBind( me.cleanString( me.type ) + "-group-" + Firebrick.utils.uniqId() );
			if ( value !== null ) {
				obj.checked = value;
			} else {
				obj.checked = "($data && $data.checked)";
			}
			
			obj.attr[ "'data-cmp-id'" ] = me.parseBind( me.getId() );
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Radio
 * @namespace components.fields
 * @class Checkbox
 */
define( 'Firebrick.ui/fields/Checkbox',[ "./Radio" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Checkbox", {
		extend: "Firebrick.ui.fields.Radio",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.checkbox",
		/**
		 * @property type
		 * @type {String}
		 * @default "'checkbox'"
		 */
		type: "checkbox",
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'checklist'"
		 */
		dataType: "checklist",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );

			if ( me.inplaceEdit ) {
				obj.editable = me.selectedOptions || false;
				obj.editableOptions = {
						optionsValue: me.parseBind( me.optionsPropValue ),
						optionsText: me.parseBind( me.optionsPropText ),
						options: me.options,
						type:  me.parseBind( me.dataType )
				};
			}
			
			return obj;
		}
	});
});


define('text!Firebrick.ui/fields/combo/Group.html',[],function () { return '<div class="fb-ui-combo-group-item">\r\n\t<span class="fb-ui-combo-group-title">{{=it[it._scope.groupLabelKey || it._scope.labelKey]}}</span>\r\n\t<div class="fb-ui-combo-group-children">\r\n\t</div>\r\n</div>';});


define('text!Firebrick.ui/fields/combo/Item.html',[],function () { return '<div class="fb-ui-combo-item">\r\n\t<span>{{=it[it._scope.labelKey]}}</span>\r\n</div>';});


define('text!Firebrick.ui/fields/combo/Value.html',[],function () { return '<div class="fb-ui-combo-value-item" data-value="{{=it[it._scope.valueKey]}}">\r\n\t<span>{{=it[it._scope.labelKey]}}</span>\r\n</div>';});


define('text!Firebrick.ui/fields/ComboBox.html',[],function () { return '<div id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}">\r\n\t<div data-bind="{{=it.dataBind(\'valueBindings\')}}"></div>\r\n\t<input type="text" data-bind="{{=it.dataBind(\'inputBindings\')}}" />\r\n\t{{?it.showCaret}}\r\n\t\t<span data-bind="{{=it.dataBind(\'singleSelectBindings\')}}"></span>\r\n\t{{?}}\r\n\t<span data-bind="{{=it.dataBind(\'clearIconBindings\')}}"></span>\r\n</div>\r\n<div data-for="{{=it.getId()}}" data-bind="{{=it.dataBind(\'resultBindings\')}}"></div>\r\n';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * Firebrick suggestions engine
 * @module Firebrick.engine
 * @class Suggest
 */
define( 'Firebrick.ui.engines/Suggest',[ "jquery", "firebrick" ], function( $ ) {
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.engines.Suggest", {
		/**
		* @property store
		* @type {Firebrick.store.Base}
		* @default null
		*/
		store: null,
		/**
		* local | remote
		* @property mode
		* @type {String}
		* @default "local"
		*/
		mode: "local",
		/**
		* @property _cache
		* @private
		* @type {Object}
		*/
		_cache: null,
		/**
		* set this property if you wish to find matches for a certain property
		* {name:"Steven", age: 10} - searchKey = "age" will result in all queries searching the age property
		* set as null|false if you want to search in all properties (if data is an object and not primitive value)
		* @property searchKey
		* @type {String | Array of Strings | null | false}
		* @default null;
		*/
		searchKeys: null,
		/**
		* used to prefetch data on init
		* @property prefetch
		*	.url {String}
		* @type {Object}
		* @default null
		*/
		prefetch: null,
		/**
		* @method init
		*/
		init: function() {
			var me = this;
			me._initCache();
		},
		/**
		* @method _initCache
		*/
		_initCache: function() {
			var me = this;
			me._cache = {};
		},
		/**
		* clears cache (search indexes)
		* @method clear
		*/
		clear: function() {
			var me = this;
			me._initCache();
		},
		/**
		* used to filter out items in when performing a query
		* @method filter
		* @param value {Value Object}
		* @return {Boolean}
		*/
		filter: function() {
			return true;
		},
		/**
		* @method query
		* @param query {String}
		* @param callback {Function}
		*/
		query: function( query, callback ) {
			var me = this,
				matches = [], data;
			
			if ( me.store ) {
				if ( me.mode === "remote" ) {
					me.store.load({
						suggest: {
							query: query
						},
						callback: function() {	//arg: data
								matches = me._query( query, me.store.toPlainObject() );
								callback( matches );
						}
					});
				} else if ( me.mode === "local" ) {
					if ( !me._cache[ query ] ) {
						matches = me._query( query, me.store.toPlainObject() );
						me._cache[ query ] = matches;
					} else {
						data = me._cache[ query ];
						matches = me._cache[ query ].filter( function() {
							return me.filter.apply( me, arguments );
						});
					}
				
					callback( matches );
				}
			}
		},
		/**
		* @method _query
		* @param query {String}
		* @param data {Array | JSON Object}
		* @return matches {Array}
		*/
		_query: function( query, data ) {
			var me = this,
				matches = [],
				childMatches = [],
				tmp,
				lookups,
				lukup,
				substrRegex = new RegExp( query, "i" ),
				it;
		
			for ( var i = 0, l = data.length; i < l; i++ ) {
				it = data[ i ];
				if ( me.filter( it ) ) {
					if ( it.exclude !== true ) {	//if exclude === true then ignore this node and children
						if ( it.suggestable !== false ) { //suggestable === false means that the current node is ignored but not their children
							lookups = me._getSearchStrings( it );
								for ( var ii = 0, ll = lookups.length; ii < ll; ii++ ) {
									//search for a match
									lukup = lookups[ ii ];
									//check for Knockout observables - maybe needed if store is defined for data
									lukup = $.isFunction( lukup ) ? lukup() : lukup;
									if ( substrRegex.test( lukup ) ) {
									matches.push( it );
									//break lookups loop
									break;
								}
							}
						}
						if ( $.isArray( it.children ) ) {
							//has child nodes
							//search child nodes too
							childMatches = me._query( query, it.children );
							if ( childMatches.length ) {
								tmp = Firebrick.utils.copyover({}, it );	//make a new copy of the parent node
								tmp.children = childMatches;	//add the matches to it
								matches.push( tmp );
							}
						}
					}
				}
			}
			
			return matches;
		},
		/**
		* returns an array of all the data which can be tested by the query method
		* @method _getSearchStrings
		* @param value {Any} query iteration value
		* @return {Array}
		*/
		_getSearchStrings: function( value ) {
			var me = this,
			searchKeys = me.searchKeys,
			str = [],
			sk;
	
			//e.g. value = {text:"Java", desc:"some kinda of programming language", icon:"java.png"}
			if ( $.isPlainObject( value ) ) {
				//searchKeys !== null
				if ( searchKeys ) {
					//searchKeys === ["text", "desc"];
					if ( $.isArray( searchKeys ) ) {
						for ( var i = 0, l = searchKeys.length; i < l; i++ ) {
							sk = searchKeys[ i ];
							if ( value.hasOwnProperty( sk ) ) {
								str.push( value[ sk ] );
							}
						}
					} else {
						if ( value.hasOwnProperty( searchKeys ) ) {
							str.push( value[ searchKeys ] );
						}
					}
				} else {
					//searchKeys === null. get all
					for ( var key in value ) {
						if ( value.hasOwnProperty( key ) ) {
							str.push( value[ key ] );
						}
					}
				}
			} else {
				//value === primitive type, string, int, boolean etc
				str.push( value );
			}
			
			return str;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class ComboBox
 */
define( 'Firebrick.ui/fields/ComboBox',[ "text!./ComboBox.html",
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
		 * return items which is currently highlighted in the dopwdown
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

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * http://www.eyecon.ro/bootstrap-datepicker/
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class Datepicker
 */
define( 'Firebrick.ui/fields/DatePicker',[ "./Input", "bootstrap-datepicker" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.DatePicker", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fields.datepicker"
		 */
		sName: "fields.datepicker",
		/**
		 * @property inputAddon
		 * @default true
		 */
		inputAddon: true,
		/**
		 * @property dateFormat
		 * @type {String}
		 * @default "yyyy/mm/dd"
		 */
		dateFormat: "dd/mm/yyyy",
		/**
		 * Sunday = 0, Saturday = 6
		 * @property weekStart
		 * @type {Integer}
		 * @default 1
		 */
		weekStart: 1,
		/**
		 * @method datePickerOptions
		 * @return {Object}
		 */
		datePickerOptions: function() {
			var me = this;
			return {
				autoclose: true,
				weekStart: me.weekStart,
				format: me.dateFormat
			};
		},
		/**
		 * glyphicon to so in the inputAddon box
		 * @property iconClass
		 * @type {String|false}
		 * @default "glyphicon-calendar"
		 */
		iconClass: "glyphicon-calendar",
		/**
		 * whether the calendar inputaddon icon is clickable or not
		 * @property clickableIcon
		 * @type {Boolean}
		 * @default true
		 */
		clickableIcon: true,
		/**
		 * @method init
		 * @return parent
		 */
		init: function() {
			var me = this;
			
			me.on( "rendered", function() {
				var el = me.getElement(),
					inputAddon,
					icon;
				
				if ( el.length ) {
					el.datepicker( me.datePickerOptions() );
				}
				
				if ( me.inputAddon && me.clickableIcon ) {
					inputAddon = el.siblings( "." + me.inputAddonClass );
					if ( inputAddon.length ) {
						icon = inputAddon.find( "." + me.iconClass );
						if ( icon.length ) {
							icon.css( "cursor", "pointer" );
							icon.on( "click", function() {
								var prop = "fb-date-open";
								if ( el.prop( prop ) === true ) {
									el.datepicker( "hide" );
									el.prop( prop, false );
								} else {
									el.prop( prop, true );
									//when the icon is clicked focus is given to the input field to open the datepicker
									el.focus();
								}
							});
						}
					}
				}
			});
			
			return me.callParent( arguments );
		},
		
		/**
		 * Immediately invoked function
		 * @property value
		 * @type {String}
		 * @default current day
		 */
		value: (function() {
			var dt = new Date();
			return "'" +  ( "0" + dt.getDate() ).slice( -2 )  + "/" + dt.getMonth() + 1 + "/" +  dt.getFullYear() + "'";
		})()
	});
});


define('text!Firebrick.ui/fields/Display.html',[],function () { return '{{?it.inplaceEdit}}\r\n\t<a id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}"></a>\r\n{{?? true }}\r\n\t<p id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}"></p>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * read only input field but doesn't look like an input field
 *
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class Display
 */
define( 'Firebrick.ui/fields/Display',[ "text!./Display.html", "./Input" ], function( subTpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Display", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-display"
		 */
		sName: "fields.display",
		/**
		 * overwrite input formControlClass
		 * @property formControlClass
		 * @type {String}
		 * @default "formControlClass fb-ui-field-display"
		 */
		formControlClass: "form-control-static",
		/**
		 * @property subTpl
		 * @type {html}
		 * @default Display.html
		 */
		subTpl: subTpl,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent(),
				text = obj.value;
			
			delete obj.attr.readonly;
			delete obj.attr.disabled;
			delete obj.attr.type;
			delete obj.attr.placeholder;
			//delete obj.value;
			
			obj.text = text;
			
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class Email
 */
define( 'Firebrick.ui/fields/Email',[ "./Input" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Email", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.email",
		/**
		 * @property type
		 * @type {String}
		 * @default "'email'"
		 */
		type: "email",
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'text'"
		 */
		dataType: "text"
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class File
 */
define( 'Firebrick.ui/fields/File',[ "./Input" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.File", {
		extend: "Firebrick.ui.fields.Input",
		sName: "fields.file",
		type: "file",
		formControlClass: false
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class Hidden
 */
define( 'Firebrick.ui/fields/Hidden',[ "./Input" ], function() {
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.fields.Hidden", {
		extend: "fields.input",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fields.hidden"
		 */
		sName: "fields.hidden",
		/**
		 * @method containerBindings
		 * @return {Object}
		 */
		containerBindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'fb-ui-hidden-field'" ] = true;
			
			return obj;
		}
	});
	
});


define('text!Firebrick.ui/fields/TextArea.html',[],function () { return '{{?it.inplaceEdit}}\r\n\t<a data-bind="{{=it.dataBind()}}"></a>\r\n{{?? true }}\r\n\t<textarea id="{{=it.getId()}}" rows="{{=it.rows}}" data-bind="{{=it.dataBind()}}"></textarea>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class TextArea
 */
define( 'Firebrick.ui/fields/TextArea',[ "text!./TextArea.html", "./Input" ], function( subTpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.TextArea", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.textarea",
		/**
		 * number of rows high
		 * @property rows
		 * @type {Int}
		 * @default 5
		 */
		rows: 5,
		/**
		 * @property subTpl
		 * @type {String}
		 */
		subTpl: subTpl,
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'textarea'"
		 */
		dataType: "textarea"
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class HtmlEditor
 */
define( 'Firebrick.ui/fields/HtmlEditor',[ "./TextArea", "summernote" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.HtmlEditor", {
		extend: "Firebrick.ui.fields.TextArea",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.htmleditor",
		/**
		 * editor configuration
		 * @property editorConf
		 * @type {Object}
		 * @default null
		 */
		editorConf: null,
		/**
		 * @method getEditorConfig
		 * @return {Object}
		 */
		getEditorConfig: function() {
			var me = this,
				editorConf = me.editorConf || {},
				obj = {
					height: 200
				};
			return Firebrick.utils.overwrite( obj, editorConf );
		},
		/**
		 * @method setValue
		 */
		_setValue: function( value ) {
			var me = this;
			return me.getElement().code( value );
		},
		/**
		 * @method getValue
		 * @return {Html}
		 */
		getValue: function() {
			var me = this;
			return me.getElement().code();
		},
		/**
		 * @method init
		 */
		init: function() {
			var me = this;
			
			if ( !me.inplaceEdit ) {
				me.on( "rendered", function() {
					me._initEditor();
				});
				me.on( "destroy", function() {
					me.getElement().destroy();
				});
			}
			
			return me.callParent( arguments );
		},
		/**
		 * @method _initEditor
		 * @private
		 */
		_initEditor: function() {
			var me = this,
				$el = me.getElement();
				
			$el.summernote( me.getEditorConfig() );
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class Password
 */
define( 'Firebrick.ui/fields/Password',[ "./Input" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Password", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-password"
		 */
		sName: "fields.password",
		/**
		 * @property type
		 * @type {String}
		 * @default "password"
		 */
		type: "password"
	});
});


define('text!Firebrick.ui/fields/SelectBox.html',[],function () { return '{{?it.inplaceEdit}}\r\n\t<a id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}"></a>\r\n{{?? true }}\r\n\t<select id="{{=it.getId()}}" data-bind="{{=it.dataBind()}}"></select>\r\n{{?}}';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class SelectBox
 */
define( 'Firebrick.ui/fields/SelectBox',[ "text!./SelectBox.html", "jquery", "knockout", "./Input" ], function( subTpl, $, ko ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.SelectBox", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.selectbox",
		/**
		 * @property multiSelect
		 * @type {Boolean}
		 * @default false
		 */
		multiSelect: false,
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl: subTpl,
		/**
		 * @property options
		 * @type {KO String|Function|Array of Objects}
		 * @default false
		 */
		options: false,
		/**
		 * @property type
		 * @type {String}
		 * @default "select"
		 */
		type: "select",
		/**
		 * @property optionsValue
		 * @type {String}
		 * @default "value"
		 */
		optionsValue: "value",
		/**
		 * @property optionsText
		 * @type {String}
		 * @default "text"
		 */
		optionsText: "text",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( !me.inplaceEdit ) {
				obj.options = Firebrick.ui.helper.optionString( me );
				if ( !me.multiSelect ) {
					obj.value = me.value;
				} else {
					obj.selectedOptions = me.value;
				}
				obj.optionsText = me.parseBind( me.optionsText );
				obj.optionsValue = me.parseBind( me.optionsValue );
				obj.attr.multiple = me.multiSelect;
			}
			
			return obj;
		},
		/**
		 * override parent method
		 * @method getInplaceEditText
		 * @private
		 * @param $data {KO Object}
		 * @return {String}
		 */
		_getInplaceEditText: function( $data ) {
			var me = this,
				$el = me.getElement(),
				value = $el ? me.getValue() : me.value,
				options = me.options,
				optVal = me.optionsValue,
				optText = me.optionsText,
				text = "",
				it, unwrapped;
			
			if ( value ) {
				
				if ( $.isFunction( options ) ) {
					options = options();
				} else if ( typeof options === "string" ) {
					options = ko.unwrap( $data.hasOwnProperty( options ) ? $data[ options ] : $data );
				}
				
				if ( !$.isArray( options ) ) {
					options = [ options ];
				}
				
				for ( var i = 0, l = options.length; i < l; i++ ) {
					it = options[ i ];
					if ( $.isPlainObject( it ) ) {
						unwrapped = ko.unwrap( it[ optVal ] );
						if ( unwrapped === value.replace( "'", "" ) ) {
							text = ko.unwrap( it[ optText ] );
							break;
						}
					}
				}
				
			} else {
				text = Firebrick.text( me.inplaceEditEmptyText );
			}
			
			return text;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @private
 * @module Firebrick.ui.components
 * @extends components.menu.Menu
 * @namespace components.menu
 * @class ContextMenu
 */
define( 'Firebrick.ui/menu/ContextMenu',[ "jquery", "./Menu", "../common/mixins/Items" ], function( $ ) {
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.menu.ContextMenu", {
		extend: "Firebrick.ui.menu.Menu",
		mixins: "Firebrick.ui.common.mixins.Items",
		sName: "menu.contextmenu",
		target: "body",
		enclosedBind: true,
		appendTarget: true,
		contextMenuEvent: null,
		
		init: function() {
			var me = this;
			
			me.on( "rendered", function() {
				me._initContext();
				me.position();
			});
			
			return me.callParent( arguments );
		},
		
		position: function() {
			var me = this,
				el = $( "> ul", me.getElement() ),
				event = me.contextMenuEvent;
	
			el.css({
				position: "absolute",
				"z-index": "10000",
				top: event.clientY,
				left: event.clientX,
				display: "block"
			});
		},
		
		_initContext: function() {
			var me = this,
				globalClick = function( e ) {
					var $e = $( e.target ),
						$el = me.getElement();
					
					if ( !$el.is( $e ) || $el.has( $e ).length ) {
						me.destroy();
						$( document ).off( "click", globalClick );
					}
					
				};
				
			$( document ).on( "click", globalClick );
		},
		
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css[ "'fb-ui-contextmenu'" ] = true;
			
			return obj;
		}
	});
	
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class Breadcrumbs
 */
define( 'Firebrick.ui/nav/Breadcrumbs',[ "../display/List" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.nav.Breadcrumbs", {
		extend: "Firebrick.ui.display.List",
		sName: "nav.breadcrumbs",
		listType: "ol",
		linkedList: true,
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			obj.css.breadcrumb = true;
			return obj;
		}
	});
});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class Pagination
 */
define( 'Firebrick.ui/nav/Pagination',[ "../display/List" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.nav.Pagination", {
		extend: "Firebrick.ui.display.List",
		sName: "nav.pagination",
		preNode: false,
		linkedList: true,
		/**
		 * "lg", "sm"
		 * @property paginationSize
		 * @type {String}
		 * @default null
		 */
		paginationSize: null,
		/**
		 * override parent
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			obj.css.pagination = true;
			if ( me.paginationSize ) {
				obj.css[ me.parseBind( "pagination-" + me.paginationSize ) ] = true;
			}
			return obj;
		},
		/**
		 * @method setActive
		 * @param val {String|Integer} - correspond to the pagination link data-value attribute
		 */
		setActive: function( val ) {
			var me = this,
				$el = me.getElement(),
				$active = me.getActive(),
				$it = $( "a[data-value='" + val + "']", $el ).parent( "li" );
			
			$active.removeClass( "active" );
			$it.addClass( "active" );
		},
		/**
		 * get active item
		 * @method getActive
		 * @return {jQuery Object} <li>
		 */
		getActive: function() {
			var me = this,
				$el = me.getElement();
			return $( "li.active", $el );
		}
	});
});

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
define( 'Firebrick.ui/table/plugins/EditableTable',[ "jquery" ], function( $ ) {
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


define('text!Firebrick.ui/table/Table.html',[],function () { return '<div data-bind="{{=it.dataBind(\'containerBindings\')}}">\r\n\t<table id={{=it.getId()}} data-bind="{{=it.dataBind()}}">\r\n\t{{?it.treetable && it.showOptions}}\r\n\t\t<caption data-bind="{{=it.dataBind(\'captionBindings\')}}">\r\n\t\t\t<a data-bind="{{=it.dataBind(\'expandBindings\')}}"></a>\r\n\t\t\t<a data-bind="{{=it.dataBind(\'collapseBindings\')}}"></a>\r\n\t\t</caption>\r\n\t{{?}}\r\n\t{{?it.showHeadings}}\r\n\t\t<thead data-bind="{{=it.dataBind(\'theadBindings\')}}">\r\n\t      <tr data-bind="{{=it.dataBind(\'theadTRBindings\')}}">\r\n\t        <th data-bind="{{=it.dataBind(\'theadTRTDBindings\')}}"></th>\r\n\t      </tr>\r\n\t    </thead>\r\n    {{?}}\r\n    {{?it.showRows}}\r\n\t    <tbody data-bind="{{=it.dataBind(\'tbodyBindings\')}}">\r\n\t      <!-- ko {{=it.dataBind(\'tbodyTRTemplateBindings\')}} --><!-- /ko -->\r\n\t    </tbody>\r\n    {{?}}\r\n\t</table>\r\n\t\r\n\t<script type="text/html" id="{{=it._getTplId()}}">\r\n\t\t<tr data-bind="{{=it.dataBind(\'tbodyTRBindings\')}}">\r\n\t\t\t<td data-bind="{{=it.dataBind(\'tbodyTRTDBindings\')}}">\r\n\t\t\t\t<span data-bind="{{=it.dataBind(\'tbodyTRTDSpanBindings\')}}"></span>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t{{?it.treetable}}\r\n\t\t<!-- ko {{=it.dataBind(\'tbodyTRChildrenTemplateBindings\')}} --><!-- /ko -->\r\n\t\t{{?}}\r\n\t</script>\r\n\t\r\n</div>';});


define('text!Firebrick.ui/table/tpls/checkbox.html',[],function () { return '<input type="checkbox" data-bind="{{=it.scope.dataBind(\'checkboxBindings\', it.value)}}" />';});

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.table
 * @class Table
 */
define( 'Firebrick.ui/table/Table',[ "knockout", "knockout-mapping", "jquery", "doT", "text!./Table.html", "text!./tpls/checkbox.html", "../common/Base",
        "datatables", "jquery-treetable", "responsive-tables-js", "./plugins/EditableTable" ], function( ko, kom, $, doT, tpl, checkboxTpl ) {
	"use strict";

	if ( !ko.bindingHandlers.trRenderer ) {
		/*
		 * optionsRenderer for list create dynamic css along with static
		 */
		ko.virtualElements.allowedBindings.trRenderer = true;
		ko.bindingHandlers.trRenderer = {
			init: function( element, valueAccessor, allBindings, viewModel  ) { //bindingContext
				var clazz = valueAccessor(), propName = clazz.propDataName, $el = $( element );

				$el.prop( propName, viewModel );
			}
		};
	}

	return Firebrick.define( "Firebrick.ui.table.Table", {
	    extend: "Firebrick.ui.common.Base",
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
	    responsiveClass: true,
	    /**
		 * activates the responsive-table-js package on the table
		 * @property responsive
		 * @type {Boolean}
		 * @default true
		 */
	    responsive: true,
	    /**
		 * @property editType
		 * @type {String} row|cell
		 * @default "row"
		 */
	    editType: "row",
	    /**
		 * @example columns: [{ mapping: {String} dot notation to property in
		 *          store json type: {String} [default=input] | number, float,
		 *          checkbox, date - used to format the value or run a default
		 *          renderer format: {String} - used to format the type if
		 *          needed. Example for type=date - format YYYY-MM-DD editable:
		 *          {Boolean} [default=true] - specify whether the cells in this
		 *          column should be editable. Only valid if the table's
		 *          editabletable is also set to true editConf: {Object} used to
		 *          configure the Editable table plugin - see Plugin for
		 *          configuration text: {String} column title (
		 *          <th></th>) renderer: {Function} define this to parse the
		 *          value before it is display and output "anything" you like -
		 *          for example to convert an String value into an <img> tag.
		 *          data-bind attributes on dynamic created elements work here
		 *          too arguments passed are -> (columnConfig, koValue,
		 *          rawValue) }]
		 * @property columns
		 * @type {Array of Objects}
		 * @default null
		 */
	    columns: null,
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
	    tableStriped: true,
	    /**
		 * @property tableHover
		 * @type {Boolean|String}
		 * @default true
		 */
	    tableHover: true,
	    /**
		 * @property tableCondensed
		 * @type {Boolean|String}
		 * @default false
		 */
	    tableCondensed: false,
	    /**
		 * @property tableBordered
		 * @type {Boolean|String}
		 * @default false
		 */
	    tableBordered: false,
	    /**
		 * @property showHeadings
		 * @type {Boolean}
		 * @default true
		 */
	    showHeadings: true,
	    /**
		 * @property showRows
		 * @type {Boolean}
		 * @default true
		 */
	    showRows: true,
	    /**
		 * activate the editable table plugin
		 * @property editabletable
		 * @type {Boolean}
		 * @default false
		 */
	    editabletable: false,
	    /**
		 * which property the data of the tr is stored to the element
		 * @property propDataName
		 * @type {String}
		 * @default "fb-ui-tr-data"
		 */
	    propDataName: "fb-ui-tr-data",
	    /**
		 * use option to enable and configure datable:
		 * http://datatables.net/examples/index
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
	    expandable: true,
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
	    showCaption: true,
	    /**
		 * works with parameter treetable
		 * @property expandText
		 * @type {String}
		 * @default "Expand"
		 */
	    expandText: "Expand",
	    /**
		 * works with parameter treetable
		 * @property collapseText
		 * @type {String}
		 * @default "Collapse"
		 */
	    collapseText: "Collapse",
	    /**
		 * whether to show the collapse / expand buttons for the treetable
		 * @property showOptions
		 * @type {Boolean}
		 * @default true
		 */
	    showOptions: true,
	    /**
		 * this is the very config that is used to configure the modal that is
		 * shown for editing a record - use the properties of
		 * Firebrick.ui.containers.Modal
		 * @example { _showEditButtons: true|false //controls whether the footer
		 *          buttons are shown [default=true] _editOkText: "OK" //
		 *          [default="OK"] only if _showEditButtons === true
		 *          _editCancelText: "Cancel" // [default="Cancel"] only if
		 *          _showEditButtons === true }
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
	    _treetable: function() {
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
	    init: function() {
		    var me = this;

		    me.data = kom.fromJS( me.data );

		    me.on( "rendered", function() {
			    var id = me.getId(), table = me.getElement();
			    if ( me.datatable && !me.treetable ) {
				    me._preTableConfig( "datatable" );
				    table.dataTable( me.datatable );
			    }

			    if ( me.editabletable ) {
				    table.EditableTable();
			    }

			    if ( me.treetable ) {
				    if ( me.showOptions ) {
					    $( "a#fb-expand-" + id ).on( "click", me.generateOnclick( "expandAll" ) );
					    $( "a#fb-collapse-" + id ).on( "click", me.generateOnclick( "collapseAll" ) );
				    }
				    me._preTableConfig( "treetable" );
				    table.treetable( me.treetable );
			    }
			    if ( me.responsive && window.responsiveTables ) {
				    window.responsiveTables.update( id );
			    }
		    } );
		    me.callParent( arguments );
	    },
	    /**
		 * used by _preTableConfig
		 * @method __preTableConfig
		 * @param propName {String}
		 * @private
		 * @return {self}
		 */
	    __preTableConfig: function( propName ) {
		    var me = this, prop = me[ propName ];
		    if ( !$.isPlainObject( prop ) && !$.isFunction( prop ) ) {
			    prop = {};
		    }
		    if ( $.isFunction( me[ propName ] ) ) {
			    prop = prop.apply( me );
		    }
		    me[ propName ] = prop;
		    return me;
	    },
	    /**
		 * @method _preTableConfig
		 * @param propName {String}
		 * @private
		 * @return {self}
		 */
	    _preTableConfig: function( propName ) {
		    var me = this, defaultProp = "_" + propName;
		    me.__preTableConfig( propName );
		    me.__preTableConfig( defaultProp );
		    me[ propName ] = Firebrick.utils.copyover( me[ propName ], me[ defaultProp ] );
		    return me;
	    },
	    /**
		 * @method containerBindings
		 * @return {Object}
		 */
	    containerBindings: function() {
		    var me = this;
		    return {
			    css: {
				    "'responsive'": me.responsiveClass
			    }
		    };
	    },
	    /**
		 * @method _getData
		 * @private
		 * @return {Object}
		 */
	    _getData: function() {
		    var me = this;
		    if ( me.store && me.store.isStore ) {
			    return "Firebrick.getById('" + me.getId() + "').getData()";
		    }
		    return {};
	    },
	    /**
		 * @method bindings
		 * @return {Object}
		 */
	    bindings: function() {
		    var me = this, obj = me.callParent( arguments );

		    obj[ "with" ] = me._getData();
		    obj.css.table = true;
		    obj.css[ "'table-striped'" ] = me.tableStriped;
		    obj.css[ "'table-hover'" ] = me.tableHover;
		    obj.css[ "'table-condensed'" ] = me.tableCondensed;
		    obj.css[ "'table-bordered'" ] = me.tableBordered;
		    obj.css[ "'responsive'" ] = me.responsive;

		    return obj;
	    },
	    /**
		 * @method theadBindings
		 * @return {Object}
		 */
	    theadBindings: function() {
		    var me = this, obj = {
			    "if": false
		    };

		    if ( me.columns ) {
			    obj[ "if" ] = true;
		    }

		    return obj;
	    },
	    /**
		 * @method theadTRBindings
		 * @return {Object}
		 */
	    theadTRBindings: function() {
		    return {
			    "foreach": "Firebrick.getById('" + this.getId() + "').columns"
		    };
	    },
	    /**
		 * @method theadTRTDBindings
		 * @return {Object}
		 */
	    theadTRTDBindings: function() {
		    var me = this;
		    return {
			    htmlWithBinding: "Firebrick.getById('" + me.getId() + "')._thRenderer($data, $context, $parent, $root)"
		    };
	    },
	    /**
		 * used by theadTRTDBindings
		 * @method _thRenderer
		 * @private
		 * @param $data
		 * @param $context
		 * @param $parent
		 * @param $root
		 * @return {Any}
		 */
	    _thRenderer: function( $data ) {
		    var me = this, type = $data.type, html = $data.text ? $data.text : $data;

		    if ( type === "checkbox" ) {
			    html = '<input type="checkbox" data-bind="' + me.dataBind( "thCheckboxBindings" ) + '" /> ' + html;
		    }

		    return html;
	    },
	    /**
		 * @method tbodyBindings
		 * @return {Object}
		 */
	    tbodyBindings: function() {
		    return {};
	    },
	    /**
		 * @method tbodyTRTemplateBindings
		 * @return {Object}
		 */
	    tbodyTRTemplateBindings: function() {
		    var me = this;
		    return {
			    template: {
			        name: me.parseBind( me._getTplId() ),
			        "foreach": "$data"
			    }
		    };
	    },
	    /**
		 * @method tbodyTRBindings
		 * @return {Object}
		 */
	    tbodyTRBindings: function() {
		    var me = this;
		    return {
		        foreach: "Firebrick.getById('" + me.getId() + "').columns",
		        "attr": {
		            "'data-tt-id'": "Firebrick.getById('" + me.getId() + "')._getItemId( $data )",
		            "'data-tt-parent-id'": "$parent._ttId"
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
	    _getItemId: function( $data ) {
		    var me = this;

		    if ( $.isPlainObject( $data ) ) {
			    if ( !$data.hasOwnProperty( "_ttId" ) ) {
				    $data._ttId = me._itemId++;
			    }
			    return $data._ttId;
		    }

		    return;
	    },
	    /**
		 * @method tbodyTRTDBindings
		 * @return {Object}
		 */
	    tbodyTRTDBindings: function() {
		    return {
			    attr: {
			        "'data-tt-id'": "$index",
			        "'fb-ui-row-id'": "$parentContext.$parent._ttId"
			    }
		    };
	    },
	    /**
		 * @method tbodyTRTDSpanBindings
		 * @return {Object}
		 */
	    tbodyTRTDSpanBindings: function() {
		    var me = this, obj = {
		        css: {},
		        allowBindings: true,
		        htmlWithBinding: "Firebrick.getById('" + me.getId() + "')._tdRenderer($data, $context, $parentContext, $root, $element)"
		    };

		    obj.css[ me.parseBind( me.tdSpanClass ) ] = true;

		    return obj;
	    },
	    /**
		 * @method _tdRenderer
		 * @private
		 * @return {Any}
		 */
	    _tdRenderer: function( $data, $context, $parentContext, $root, $element ) {
		    var me = this, data = Firebrick.utils.getDeepProperty( $data.mapping, $parentContext.$data ), //get the value of mapping property in the parent data object
		    value = me.b( data ), //get the primitive value - so if an observable (function) simply call it, else return primitive
		    type = $data.type, //check the column for the type specified
		    cssClazz = "fb-ui-col-" + $context.$index();

		    if ( !$data._colId ) {
			    $data._colId = cssClazz;
		    }

		    $( $element ).addClass( cssClazz );

		    if ( type ) {
			    if ( type === "number" ) {
				    value = parseInt( value );
			    } else if ( type === "float" ) {
				    value = parseFloat( value );
			    } else if ( type === "checkbox" ) {
				    if ( data !== null ) {
					    if ( typeof value === "string" ) {
						    value = value === "true" ? true : false;
					    }
					    value = me.checkboxRenderer( $data, data, value, $context, $parentContext, $root, $element );
				    }
			    }
		    }

		    if ( $data.renderer ) {
			    value = $data.renderer( $data, data, value, $context, $parentContext, $root, $element );
		    }

		    return value;
	    },
	    /**
		 * @method thCheckboxBindings
		 * @return {Object}
		 */
	    thCheckboxBindings: function() {
		    var me = this, obj = {};

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
	    _allCheckedObservable: function( $context ) {
		    var me = this, $col = $context.$data, $el = me.getElement();
		    //store in prop and return that prop to stop memory leak from occurring
		    me._allCheckedObservableProp = me._allCheckedObservableProp || ko.computed( {
		        read: function() {
			        var mapping = $col.mapping, data = me.getData(), func = function( _data ) { //recursive function
				        var it, children;
				        it = Firebrick.utils.getDeepProperty( mapping, _data ); //returns property or null
				        if ( $.isFunction( it ) && !it() ) {
					        return false;
				        } else if ( _data.children ) {
					        children = _data.children();
					        for ( var i = 0, l = children.length; i < l; i++ ) {
						        return func( children[ i ] );
					        }
				        }
				        return true;
			        };

			        if ( data && $.isFunction( data ) ) {
				        data = data();
				        for ( var i = 0, l = data.length; i < l; i++ ) {
					        return func( data[ i ] ); //iterate over all properties and children to determine whether the checkbox should be checked initially
				        }
			        }

			        return false;
		        },
		        write: function( newValue ) {
			        var $selector = $( "tbody tr", $el ), data, mapping = $col.mapping;
			        for ( var i = 0, l = $selector.length; i < l; i++ ) {
				        data = Firebrick.utils.getDeepProperty( mapping, $( $selector[ i ] ).prop( me.propDataName ) ); //returns property or null
				        if ( $.isFunction( data ) ) {
					        data( newValue );
				        }
			        }
		        }
		    } );
		    return me._allCheckedObservableProp;
	    },
	    /**
		 * @method checkboxRenderer
		 * @param $data
		 * @param data
		 * @param value
		 * @return {String} HTML
		 */
	    checkboxRenderer: function( $data, data, value ) {
		    var me = this;
		    return doT.template( checkboxTpl )( {
		        scope: me,
		        value: value
		    } );
	    },
	    /**
		 * used by checkbox tpl
		 * @method checkboxBindings
		 * @param value
		 * @return
		 */
	    checkboxBindings: function( ) {
		    return {
			    checked: "Firebrick.utils.getDeepProperty( $data.mapping, $parent )"
		    };
	    },
	    /**
		 * @private
		 * @method _getTplId
		 * @return {String}
		 */
	    _getTplId: function() {
		    return "fb-ui-tpl-" + this.getId();
	    },
	    /**
		 * @method tbodyTRChildrenTemplateBindings
		 * @return {Object}
		 */
	    tbodyTRChildrenTemplateBindings: function() {
		    var me = this;
		    return {
			    template: {
			        name: me.parseBind( me._getTplId() ),
			        "foreach": "$data.children"
			    }
		    };
	    },
	    /**
		 * @method captionBindings
		 * @return {Object}
		 */
	    captionBindings: function() {
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
	    generateOnclick: function( type ) {
		    var me = this;
		    return function() {
			    me.getElement().treetable( type );
			    return false;
		    };
	    },
	    /**
		 * @method expandBindings
		 * @return {Object}
		 */
	    expandBindings: function() {
		    var me = this;
		    return {
		        text: me.textBind( "expandText" ),
		        attr: {
		            id: me.parseBind( "fb-expand-" + me.getId() ),
		            href: "''"
		        }
		    };
	    },
	    /**
		 * @method collapseBindings
		 * @return {Object}
		 */
	    collapseBindings: function() {
		    var me = this;
		    return {
		        text: me.textBind( "collapseText" ),
		        attr: {
		            id: me.parseBind( "fb-collapse-" + me.getId() ),
		            href: "''"
		        }
		    };
	    }

	} );
} );

/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.table.Table
 * @namespace components.table
 * @class TreeTable
 */
define( 'Firebrick.ui/table/TreeTable',[ "./Table", "jquery-treetable" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.table.TreeTable", {
		extend: "Firebrick.ui.table.Table",
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
		store: false,
		/**
		 * @property treetable
		 * @type {Boolean}
		 * @default true
		 */
		treetable: true
	});
});

