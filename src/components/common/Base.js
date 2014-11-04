/**
 * Super class for all components
 * Extends: {{#crossLink "Firebrick.class.Base"}}{{/crossLink}}
 * @module Firebrick.ui.components
 * @extends Firebrick.class.Base
 * @namespace Firebrick.ui.components.common
 * @class Base
 */
define(["handlebars"], function(Handlebars){

	Handlebars.registerHelper('data-bind', function(arg, scope) {
		if(typeof arg == "string"){
			return scope.data.root["data-bind"](arg);
		}
		
		return arg.data.root["data-bind"]();
	});
	
	
	return Firebrick.define("Firebrick.ui.common.Base", {
		extend:"Firebrick.class.Base",
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
		 * @property glyphiconClass
		 * @type {String}
		 * @default "glyphicon"
		 */
		glyphiconClass: "glyphicon",
		/**
		 * target to render the component to (not needed if combined with a view) (optional)
		 * @property renderTo
		 * @optional
		 * @type {Boolean, String, Object} false, selector, jQuery Object
		 * @default false
		 */
		renderTo:false,
		/**
		 * cache
		 * @property _build
		 * @private
		 * @default ""
		 */
		_build:"",
		/**
		 * used in conjunction with property "renderTo"
		 * @property appendComponent
		 * @type {Boolean}
		 * @default false
		 */
		appendComponent:false,
		/**
		 * when overriding this or any other method, this.callParent() calls the method in the super class
		 * @method init
		 */
		init: function(){
			var me = this;
			if($.isPlainObject(me.bindings)){
				Firebrick.utils.mixinFor("bindings", me);	
			}
			if(me.renderTo){
				me.on("ready", function(){
					Firebrick.views.renderTo(Firebrick.views.getTarget(me.renderTo), me.build(), me.appendComponent);
				});
			}
			return this.callParent();
		},
		/**
		 * @method build
		 * @param {String} [prop=this.tpl]
		 * @returns {String} html 
		 */
		build: function(prop){
			var me = this;
			if(!me._build){
				me._build = Handlebars.compile(prop ? me[prop] : me.tpl)(me);
			}
			return me._build;
		},
		/**
		 * @method data-bind
		 * @param {String} [property=this.bindings]
		 * @private
		 * @return {String}
		 */
		"data-bind": function(property){
			var prop = property ? this[property] : this.bindings;
			if($.isFunction(prop)){
				prop = prop.call(this);
			}
			return Firebrick.ui.utils.stringify( prop );
		},
		/**
		 * shorthand for getClassId()
		 * @method getId 
		 * @returns {String} uniqueId
		 */
		getId: function(){
			return this.getClassId();
		},
		/**
		 * called when calling {{{getSubTpl}}} in component template
		 * @method getSubTpl
		 * @returns {String}
		 */
		getSubTpl: function(){
			return this.build("subTpl");
		},
		/**
		 * find the parent of this class
		 * iterate up the inheritance tree looking for a classname that differs from the current and that "subTpl" or "tpl" don't match either
		 * @private
		 * @method _getParent
		 * @returns {Object}
		 */
		_getParent: function(clazz){
			var me = clazz || this,
				p = Object.getPrototypeOf(me);

			if(me._classname != p._classname){
				if((me.subTpl != p.subTpl) || (me.tpl != p.tpl)){
					return p;
				}
			}
		  
			return this._getParent(p);
		},
		/**
		 * called when calling {{{getParentTpl}}} in component template
		 * @method getParentTpl
		 * @returns {String}
		 */
		getParentTpl: function(){
			var me = this;
			return Handlebars.compile(me._getParent().subTpl)(me);
		},
		/**
		 * clean string - i.e. remove all ' from string
		 * @method cleanString
		 * @returns {String}
		 */
		cleanString: function(string){
			return string.replace(/\'/g, "");
		}
	});
});
	