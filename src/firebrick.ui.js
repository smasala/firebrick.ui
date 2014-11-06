/*!
* Firebrick UI
* Author: Steven Masala
* me@smasala.com
* FirebrickUI, component library for Firebrick JS
**/
(function(root, factory) {
	
  "use strict";

  if (typeof define === "function" && define.amd) {
    define(["jquery", "firebrick", "knockout", "knockout-mapping", "text", "handlebars"], function($, fb, ko, kom, text, hb) {
    	ko.mapping = kom;
    	return factory($, fb, ko, hb);
    });
  } else {
	  return factory(root.jQuery, root.Firebrick, root.ko, root.Handlebars);
  }

})(this, function($, Firebrick, ko, Handlebars) {
	
	if(!Firebrick){
		console.error("Firebrick has not been loaded, Firebrick-UI requires Firebrick JS to function");
		return;
	}else if(Firebrick.ui){
		console.error("Firebrick.ui namespace has already been taken!");
		return;
	}
	
	/**
	 * Firebrick component library for Firebrick JS MVC
	 * @module Firebrick
	 * @namespace Firebrick
	 * @class ui
	 */
	Firebrick.ui = {
			/**
			 * library version number
			 * @property version
			 * @private
			 * @type {String}
			 */
			version: "0.1.4",
			
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
			 * @param {Object} config.view Firebrick view class (optional)
			 * @return {String} html
			 */
			build: function(config){
				var me = this,
					target = Firebrick.views.getTarget(config.target),
					r, html;
				
				if(config.view){
					config.view.on("ready", function(){
						$.each(r.items, function(i,f){
							f.fireEvent("componentReady");
						});
					});
				}
				
				r = me._populate(config.items, config.view);
				html = r.html;
				
				if(target){
					target.append(html);
				}
				
				return html;
			},
			
			/**
			 * recursive function
			 * 
			 * @private
			 * @method _populate
			 * @return {Object} :: {html: string, items: array of objects}
			 */
			_populate: function(items, parent){
				var me = this,
					x = [],
					h = "", 
					component, tmp;

				$.each(items, function(i,v){
					if(!v.uiComponent){
						//v can be string or object
						tmp = me.getByShortName(($.isFunction(v.uiName) ? v.uiName() : v.uiName) || v);
						//getPrototypeOf(object.create) to make a new copy of the object and not a prototype pointer to v
						component = Firebrick.create(tmp._classname, (v.uiName ? Object.getPrototypeOf(Object.create(v)) : null) );
					}else{
						//v is already a field class
						component = v;
					}
					component._parent = parent;
					h += component.build();
					x.push(component);
				});
				
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
					$.each(Firebrick.classes.classRegistry, function(k, v){
						if(v.uiComponent && v.uiName == name){
							item = v;
							me._searchCache[name] = v;
							return false;
						}
					});
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
			 * @module Firebrick.ui
			 * @namespace Firebrick.ui
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
							var p = f ? "" : "{";
							$.each(obj, function(k,v){
								if($.isPlainObject(v)){
									p += k + ":" + loop(v);
								}else{
									p += k + ": " + v + ","
								}
							});
							//remove last ", "
							p = p.substr(-1) == "," ? p.substring(0, p.length-1) : p;
							p += f ? "" : "},";
							return p;
						}
						
						return loop(objToConvert, true);
					}
					return "";
				}
				
			}
			
			
	};
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