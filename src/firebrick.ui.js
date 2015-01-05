/*!
* Firebrick UI
* @author Steven Masala [me@smasala.com]
* 
* FirebrickUI, component library for Firebrick JS
**/
(function(root, factory) {
	
  "use strict";
  
  if (typeof define === "function" && define.amd) {
    define(["jquery", "firebrick", "knockout", "knockout-mapping", "text"], function($, fb, ko, kom, text, hb) {
    	ko.mapping = kom;
    	return factory($, fb, ko, hb);
    });
  } else {
	  return factory(root.jQuery, root.Firebrick, root.ko);
  }

})(this, function($, Firebrick, ko) {
	
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
			version: "0.9.7",
			
			/**
			 * used to cache pointers to classes when searching by "uiName"
			 * 
			 * @private
			 * @property _searchCache
			 * @type {Object}
			 */
			_searchCache:{},
			
			/**
			 * populate a target with fields and data
			 * 
			 * @method build
			 * @param {Object} config
			 * @param {Object} config.target selector string, jquery object (optional) if none passed, html is returned
			 * @param {Object} config.items array of strings or objects ["fb-ui-input", {uiName:"fb-ui-textarea"}]
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
			 * components uiNames are populated into this map for variable access
			 * fb.ui.cmp.input
			 * @property cmp
			 * @type {Object}
			 * @default {}
			 */
			cmp:{},
			
			/**
			 * recursive function
			 * create components and html from an array of items
			 * @private
			 * @method _populate
			 * @return {Object} :: {html: string, items: array of objects}
			 */
			i:0,
			_populate: function(items, parent){
				var me = this,
					x = [],
					h = "", 
					component, tmp;

				if($.isFunction(items)){
					items = items();
				}
				
				var v;
				for(var i = 0, l = items.length; i<l; i++){
					v = items[i];
					if(v.isView){
						if(v._state === "initial"){
							component = v.init();
						}
						h += component.tpl;
					}else if(v.viewName){
						//Creates a view from a JS file
						//Firebrick.create("MyApp.view.MyView", {})
						component = Firebrick.create(v.viewName, v);
						h += component.tpl;
					}else{
						if(!v.uiComponent){
							//v can be string or object
							tmp = me.getByShortName(v.uiName || v);
							//Object.getPrototypeOf(object.create) to make a new copy of the properties and not a pointer to v
							component = Firebrick.create(tmp._classname, (v.uiName ? Object.getPrototypeOf(Object.create(v)) : null));
						}else{
							//v is already a field class
							component = v;
						}
						//sometimes needed before build - grid column for example
						component._parent = parent;
						h += component.build();
					}
					if(!component._parent){
						//if not set yet
						component._parent = parent;
					}
					x.push(component);
				}
				
				return {html: h, items: x};
			},
			
			/**
			 * get a component class by its shortname... uiName
			 * 
			 * @method getByShortName
			 * @param {String} name (uiName)
			 * @return {Object}
			 */
			getByShortName: function(name){
				var me = this,
					item = me._searchCache[name];
				if(!item){
					var k, v;
					for(k in Firebrick.classes.classRegistry){
						if(Firebrick.classes.classRegistry.hasOwnProperty(k)){
							v = Firebrick.classes.classRegistry[k];
							if(v.uiComponent && v.uiName === name){
								item = v;
								me._searchCache[name] = v;
								break;
							}
						}
					}
				}
				
				if(!item){
					console.error("ui component", name, "not found");
				}
				return item;
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
					return me._registry[name];
				}
			}
			
			
	};
	
	/**
	 * Overwrites "Firebrick.view.Base" 
	 * @extends class.Base
	 * @class view.Base
	 */
	Firebrick.classes.overwrite("Firebrick.view.Base", {
		/**
		 * @property listeners
		 * @type {Object}
		 */
		listeners:{
			rendered: function(){
				var me = this;
				if($.isArray(me.items)){
					for(var i = 0, l = me.items.length; i<l; i++){
						me.items[i].fireEvent("rendered");
					}
				}
			}
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
	        var innerBindingContext = bindingContext.extend(valueAccessor);
	        ko.applyBindingsToDescendants(innerBindingContext, element);
	        // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
	        return { controlsDescendantBindings: true };
	    }
	};
	
});