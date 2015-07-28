/*!
* Firebrick UI
* @author Steven Masala [me@smasala.com]
* 
* FirebrickUI, component library for Firebrick JS
**/
(function(root, factory) {
	
  "use strict";
  
  if (typeof define === "function" && define.amd) {
    define(["jquery", "firebrick", "knockout",  "devicejs", "knockout-mapping", "text"], function($, fb, ko, dev, kom, text) {
    	ko.mapping = kom;
    	return factory($, fb, ko, dev);
    });
  } else {
	  return factory(root.jQuery, root.Firebrick, root.ko);
  }

})(this, function($, Firebrick, ko, device) {
	
	"use strict";

	if(!Firebrick){
		console.error("Firebrick has not been loaded, Firebrick-UI requires Firebrick JS to function");
		return;
	}else if(Firebrick.ui){
		console.error("Firebrick.ui namespace has already been taken!");
		return;
	}
	
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
			version: "0.20.0",
			
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
			build: function(config){
				var me = this,
					target = Firebrick.views.getTarget(config.target),
					r, html;
				
				r = me._populate(config.items, config.view);
				html = r.html;
				
				if(config.view && r.items.length){
					config.view.items = r.items;
				}
				
				if(target){
					target.append(html);
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
			_populate: function(items, parent){
				var me = this,
					_items = [],
					html = "",
					component;

				if($.isFunction(items)){
					items = items();
				}

				if(!$.isArray(items) && items){
					items = [items];
				}
				
				if($.isArray(items) && items.length){
					if(parent.defaults){
						//get all defaults down the prototype tree
						Firebrick.utils.merge("defaults", parent);
						//add the defaults to direct items
						//TODO: if items is a function?
						for(var i = 0, l = items.length; i<l; i++){
							items[i] = Firebrick.utils.copyover(items[i], parent.defaults);
						}
					}
					
					for(var i = 0, l = items.length; i<l; i++){
						component = me._buildComponent(items[i], parent);
						html += component._html;
						//cache component pointer so it can be found by id
						if(!component.getId){
							console.error("something went wrong", items[i], "is it defined correctly? Check the item name and dependency include");
						}
						component.fireEvent("uiBuilt");
						_items.push(component);
					}
				}
				
				return {html: html, items: _items};
			},
			
			/**
			 * method used by _populate
			 * @private
			 * @method _buildComponent
			 * @param v {Object|String} component or name of component
			 * @param parent {Object} component parent object
			 * @return {Object} component
			 */
			_buildComponent: function(v, parent){
				var me = this,
					component, 
					tmp;
				
				if(v.isView){
					if(v._state !== "initial"){
						component = v.init();
					}
					component = v;
				}else if(v.viewName){
					//Creates a view from a JS file
					//Firebrick.create("MyApp.view.MyView", {})
					component = Firebrick.create(v.viewName, v);
				}else{
					
					v = me._componentFilter(v);
					
					if(!v.uiComponent){
						//v can be string or object
						tmp = Firebrick.get(v.sName || v);
						if(!tmp){
							console.error("Has", (v.sName || v), "been added as a dependency?");
						}
						//Object.getPrototypeOf(object.create) to make a new copy of the properties and not a pointer to v
						component = Firebrick.create(tmp._classname, (v.sName ? Object.getPrototypeOf(Object.create(v)) : null));
					}else{
						//v is already a field class
						component = v;
					}
				}
				
				if(!component._parent){
					//if not set yet
					component._parent = parent;
				}
				
				if(component.build){
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
			_componentFilter: function(name){
				//var me = this;
				
				if(typeof name === "string"){
					switch(name){
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
			getCmp: function(id){
				return Firebrick.getById(id);
			},
			
			/**
			 * alias for Firebrick.get
			 * 
			 * @method get
			 * @param {String} name
			 * @return {Object}
			 */
			get: function(name){
				return Firebrick.get(name);
			},
			
			/**
			 * util methods
			 * @for ui
			 * @class utils
			 */
			utils:{
				
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
				_buildDotObj: function(arr, sName, prev){
					var me = this,
						prop = arr.shift(); //remove the first item use it as property name
					
					//check if prev has already been initialised
					prev = prev || {};
						
					prev[ prop ] = {};
					
					//more items in arr?
					if(arr.length){
						if(arr[0] !== ""){
							//call self recursively
							me._buildDotObj(arr, sName, prev[ prop ]);
						}else{
							console.error("error building sName, found empty string", arr, prop, sName);
						}
						
					}else{
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
				isVisible: function($element, $container){
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
						check = function(coord){
							if(coord > cont.offset.top && coord < cont.offset.left){
								if(coord < cont.bottom){
									return true;
								}
							}
							return false;
						};
					
					cont.bottom = cont.offset.top + cont.height;
					el.bottom = el.offset.top + el.height;
					
					if( check(el.offset.top) || 
						check(el.offset.top + el.width) ||  
						check(el.bottom) ||
						check(el.bottom + el.width) ){
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
				getValue: function(val){
					if($.isFunction(val)){
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
				stringify:function(objToConvert){
					if(objToConvert){
						
						var loop = function(obj, f){
							var p = f ? "" : "{",
								k,v;
							for(k in obj){
								if(obj.hasOwnProperty(k)){
									v = obj[k];
									if($.isPlainObject(v)){
										p += k + ":" + loop(v);
									}else{
										p += k + ": " + v + ",";
									}
								}
							}
							//remove last ", "
							p = p.substr(-1) === "," ? p.substring(0, p.length-1) : p;
							p += f ? "" : "},";
							return p;
						};
						
						return loop(objToConvert, true);
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
				 * builds the items string used for functions such as "foreach"
				 * @method tabBuilder
				 * @param componentId {Objects} 
				 * @return {String} 
				 */
				tabBuilder: function(componentId){
					var component = Firebrick.getById(componentId),
						data = component.items;
					
					if($.isFunction(data)){
						return "Firebrick.getById('" + componentId + "').items()";
					}else if($.isArray(data)){
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
				optionString: function(component){
					var data = component.options;
					
					if($.isFunction(data)){
						return "Firebrick.ui.getCmp('" + component.getId() + "').options()";
					}else if($.isArray(data)){
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
				linkBuilder: function(value){

					if(value){
						if( typeof value.link === "string" ){
							return value.link;
						}else if( typeof value.href === "string"){
							return value.href;
						}
					}
					
					return false;
				},
				
				
				callFunction: function(classId, functionName, args){
					var clazz = Firebrick.getById(classId);
					if(clazz && functionName){
						clazz[functionName].apply(clazz, args);
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
				_registry:{},
				
				/**
				 * @method add
				 * @param name {String} name of the renderer
				 * @param func {Function} function to call when the renderer is used - parameters given to the function when called: $data, $context, $parent, $root
				 * @return self
				 */
				add: function(name, func){
					var me = this;
					
					me._registry[name] = func;
					
					return me;
				},
				
				/**
				 * @method get
				 * @param name {String} name of the renderer
				 * @return {Function || null}
				 */
				get: function(name){
					var me = this;
					if($.isFunction(name)){
						//catch KO function variation
						name = name();
					}
					return me._registry[name];
				}
			},
			
			/**
			 * @property _sNames
			 * @private
			 * @type {Object}
			 */
			_sNames: {
					"button.dropdown.list":{
						path:"Firebrick.ui/button/dropdown/List"
					},
					"button.button":{
						path:"Firebrick.ui/button/Button"
					},
					"button.buttongroup":{
						path:"Firebrick.ui/button/ButtonGroup"
					},
					"button.icon":{
						path:"Firebrick.ui/button/Icon"
					},
					"button.togglebutton":{
						path:"Firebrick.ui/button/ToggleButton"
					},
					"containers.border.pane":{
						path:"Firebrick.ui/containers/border/Pane"
					},
					"containers.tab.pane":{
						path:"Firebrick.ui/containers/tab/Pane"
					},
					"containers.accordion":{
						path:"Firebrick.ui/containers/Accordion"
					},
					"containers.borderlayout":{
						path:"Firebrick.ui/containers/BorderLayout"
					},
					"containers.box":{
						path:"Firebrick.ui/containers/Box"
					},
					"containers.form":{
						path:"Firebrick.ui/containers/Form"
					},
					"containers.formpanel":{
						path:"Firebrick.ui/containers/FormPanel"
					},
					"containers.gridcolumn":{
						path:"Firebrick.ui/containers/GridColumn"
					},
					"containers.gridrow":{
						path:"Firebrick.ui/containers/GridRow"
					},
					"containers.modal":{
						path:"Firebrick.ui/containers/Modal"
					},
					"containers.fieldset": {
						path:"Firebrick.ui/containers/Fieldset"
					},
					"containers.panel":{
						path:"Firebrick.ui/containers/Panel"
					},
					"containers.tabpanel":{
						path:"Firebrick.ui/containers/TabPanel"
					},
					"display.alert":{
						path:"Firebrick.ui/display/Alert"
					},
					"display.divider":{
						path:"Firebrick.ui/display/Divider"
					},
					"display.header":{
						path:"Firebrick.ui/display/Header"
					},
					"display.image":{
						path:"Firebrick.ui/display/Image"
					},
					"display.list":{
						path:"Firebrick.ui/display/List"
					},
					"display.progress":{
						path:"Firebrick.ui/display/Progress"
					},
					"display.span":{
						path:"Firebrick.ui/display/Span"
					},
					"display.text":{
						path:"Firebrick.ui/display/Text"
					},
					"display.loader": {
						path:"Firebrick.ui/display/Loader"
					},
					"fields.checkbox":{
						path:"Firebrick.ui/fields/Checkbox"
					},
					"fields.datepicker":{
						path:"Firebrick.ui/fields/DatePicker"
					},
					"fields.display":{
						path:"Firebrick.ui/fields/Display"
					},
					"fields.combobox":{
						path:"Firebrick.ui/fields/ComboBox"
					},
					"fields.email":{
						path:"Firebrick.ui/fields/Email"
					},
					"fields.file":{
						path:"Firebrick.ui/fields/File"
					},
					"fields.input":{
						path:"Firebrick.ui/fields/Input"
					},
					"fields.password":{
						path:"Firebrick.ui/fields/Password"
					},
					"fields.radio":{
						path:"Firebrick.ui/fields/Radio"
					},
					"fields.selectbox":{
						path:"Firebrick.ui/fields/SelectBox"
					},
					"fields.textarea":{
						path:"Firebrick.ui/fields/TextArea"
					},
					"nav.breadcrumbs":{
						path:"Firebrick.ui/nav/Breadcrumbs"	
					},
					"nav.list":{
						path:"Firebrick.ui/nav/List"
					},
					"nav.navbar":{
						path:"Firebrick.ui/nav/Navbar"
					},
					"nav.pagination":{
						path:"Firebrick.ui/nav/Pagination"
					},
					"nav.toolbar":{
						path:"Firebrick.ui/nav/Toolbar"	
					},
					"table.table":{
						path:"Firebrick.ui/table/Table"
					},
					"table.treetable":{
						path:"Firebrick.ui/table/TreeTable"
					}
			}
			
	};
	
	Firebrick.classes.addSNames(Firebrick.ui._sNames);
	
	
	/**
	 * Overwrites "Firebrick.view.Base" 
	 * @extends class.Base
	 * @class view.Base
	 */
	Firebrick.classes.overwrite("Firebrick.view.Base", {
		_ko:null,
		/**
		 * @property passDownEvents
		 * @type {Object}
		 * @default {
				rendered: 1,
				htmlRendered: 1,
				unbound: 1
			}
		 */
		passDownEvents:{
			rendered: 1,
			htmlRendered: 1,
			unbound: 1,
			destroy: 1
		},
		
		listeners: {
			uiBuilt: function(){
				var me = this,
					k;
				if(me.passDownEvents){
					
					Firebrick.utils.merge("passDownEvents", me);
					
					for(k in me.passDownEvents){
						if(me.passDownEvents.hasOwnProperty(k)){
							if(me._parent){
								me._initPassDownEvent(k);
							}
						}
					}
					
				}
			}
		},
		/**
		 * @method _initPassDownEvent
		 */
		_initPassDownEvent: function(eventName){
			var me = this,
				f = me._createPassEvent(me);
			
			me._parent.on(eventName, f);
			me.on("destroy", function(){
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
		_createPassEvent: function(scope){
			return function(){
				var me = this,
					args = Array.prototype.slice.call(arguments);
				args = [me.event.eventName].concat(args);
				scope.fireEvent.apply(scope, args);	
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
		tpl: function(){
			var me = this;
			if(me.items){
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
	(function(ko){
		
		var oldInit = ko.bindingHandlers.value.init, 
			oldInit1 = ko.bindingHandlers.selectedOptions.init;
		
		//VALUE
		ko.bindingHandlers.value.init = function(element, valueAccessor, allBindings, viewModel, bindingContext){
			var clazz = Firebrick.getById(element.getAttribute("id"));
			if(clazz){
				clazz._ko = clazz._ko || {};
				clazz._ko.value = {
					element: element,
					valueAccessor: valueAccessor,
					allBindings: allBindings,
					viewModel: viewModel,
					bindingContext: bindingContext
				};
			}
			return oldInit.apply(this, arguments);
		};

		//SELECTEDOPTIONS
		ko.bindingHandlers.selectedOptions.init = function(element, valueAccessor, allBindings, viewModel, bindingContext){
			var clazz = Firebrick.getById(element.getAttribute("id"));
			if(clazz){
				clazz._ko = clazz._ko || {};
				clazz._ko.selectedOptions = {
					element: element,
					valueAccessor: valueAccessor,
					allBindings: allBindings,
					viewModel: viewModel,
					bindingContext: bindingContext
				};
			}
			return oldInit1.apply(this, arguments);
		};
		
		/*
		 * use withProperties to pass extra properties down to the descendants
		 * http://knockoutjs.com/documentation/custom-bindings-controlling-descendant-bindings.html
		 */
		ko.bindingHandlers.withProperties = {
		    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		        // Make a modified binding context, with a extra properties, and apply it to descendant elements
		        var childBindingContext = bindingContext.createChildContext(
		            bindingContext.$rawData,
		            null, // Optionally, pass a string here as an alias for the data item in descendant contexts
		            function(context) {
		                ko.utils.extend(context, valueAccessor());
		            });
		        ko.applyBindingsToDescendants(childBindingContext, element);
		 
		        // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
		        return { controlsDescendantBindings: true };
		    }
		};
		
		//activate binding on any element injected with "html" property
		//modified from http://stackoverflow.com/a/29605553/425226
		ko.bindingHandlers.htmlWithBinding = {
			  'init': function() {
				  return { 'controlsDescendantBindings': true };
			  },
			  'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
				  element.innerHTML = valueAccessor();
				  ko.applyBindingsToDescendants(bindingContext, element);
			  }
		};
		
		/*
		 * use debug to simply console out any given arguments
		 * http://www.knockmeout.net/2013/06/knockout-debugging-strategies-plugin.html
		 */
		ko.virtualElements.allowedBindings.debug = true;
		ko.bindingHandlers.debug = {
		    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		       console.warn("Debug:", element, valueAccessor(), allBindings(), viewModel, bindingContext);
		    }
		};
		
	})(ko);
	
});