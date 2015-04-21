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
			version: "0.14.0",
			
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
				
//				if(config.view){
//					config.view.on("ready", function(){
//						for(var i = 0, l = r.items.length; i<l; i++){
//							r.items[i].fireEvent("rendered");	
//						}
//					});
//				}
				
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
				 * builds links, if value then return the value overwise return javascript:void(0)
				 * @method linkBuilder
				 * @param {Object} value - optional
				 * @param {Object} value.link
				 * @return {String}
				 */
				linkBuilder: function(value){
					if(value){
						if(typeof value.link === "string"){
							return value.link;
						}
					}
					
					return "javascript:void(0)";
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
					"fields.checkbox":{
						path:"Firebrick.ui/fields/Checkbox"
					},
					"fields.datepicker":{
						path:"Firebrick.ui/fields/DatePicker"
					},
					"fields.display":{
						path:"Firebrick.ui/fields/Display"
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
			unbound: 1
		},
		
		/**
		 * used with passDownEvents
		 * @property passToProperties
		 * @type {Object}
		 * @default {
		 * 	items: 1
		 * }
		 */
		passToProperties:{
			items: 1,
			inputAddon: 1
		},
		
		listeners: {
			preReady: function(){
				var me = this,
					k;
				if(me.passDownEvents){
					
					Firebrick.utils.merge("passDownEvents", me);
					Firebrick.utils.merge("passToProperties", me);
					
					for(k in me.passDownEvents){
						if(me.passDownEvents.hasOwnProperty(k)){
							me.on(k, me._createPassEvent());
						}
					}
					
				}
			}
		},
		
		/**
		 * @method _createPassEvent
		 * @private
		 * @return {Function}
		 */
		_createPassEvent: function(){
			return function(){
				var me = this,
				items,
				args = arguments,
				key,
				cmp,
				properties = me.passToProperties;
				
				for(key in properties){
					items = me[key];
					if(items){
						if($.isArray(items)){
							for(var i = 0, l = items.length; i<l; i++){
								cmp = items[i];
								if(cmp.passEvent){
									cmp.passEvent(args);
								}
							}
						}
					}
				}
				
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
	
	/*
	 * use debug to simply console out any given arguments
	 * http://www.knockmeout.net/2013/06/knockout-debugging-strategies-plugin.html
	 */
	ko.bindingHandlers.debug = {
	    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
	       console.warn("Debug:", element, valueAccessor(), allBindings(), viewModel, bindingContext);
	    }
	};
	
});