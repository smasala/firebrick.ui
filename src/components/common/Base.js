/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * Super class for all components.
 * 
 * Extends from <a href="http://smasala.github.io/firebrick/docs/classes/class.Base.html">Firebrick.class.Base</a>
 * @module Firebrick.ui.components
 * @extends class.Base
 * @namespace components.common
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
		 * component id, not the _classId - however if none specified it will default to the _classId
		 * @property id,
		 * @type {String}
		 * @default null
		 */
		id:null,
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
		 * @type {Boolean|String|Object} false, selector, jQuery Object
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
		 * template
		 * @property tpl
		 * @type {String} html
		 * @default null
		 */
		tpl: null,
		/**
		 * uiName
		 * @property uiName
		 * @type {String}
		 * @default null
		 */
		uiName:null,
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
		 * @return {String} html 
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
		 * if no id is specified it will call getClassId() and use that value
		 * @method getId 
		 * @return {String} uniqueId
		 */
		getId: function(){
			var me = this,
				id = me.id;
			if(!id){
				id = this.getClassId();
				me.id = id;
			}
			return id;
		},
		/**
		 * called when calling {{{getSubTpl}}} in component template
		 * @method getSubTpl
		 * @return {String}
		 */
		getSubTpl: function(){
			return this.build("subTpl");
		},
		/**
		 * find the parent of this class
		 * iterate up the inheritance tree looking for a classname that differs from the current and that "subTpl" or "tpl" don't match either
		 * @private
		 * @method _getParent
		 * @return {Object}
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
		 * @return {String}
		 */
		getParentTpl: function(){
			var me = this;
			return Handlebars.compile(me._getParent().tpl)(me);
		},
		/**
		 * called when calling {{{getParentSubTpl}}} in component template
		 * @method getParentSubTpl
		 * @return {String}
		 */
		getParentSubTpl: function(){
			var me = this;
			return Handlebars.compile(me._getParent().subTpl)(me);
		},
		/**
		 * clean string - i.e. remove all ' from string
		 * @method cleanString
		 * @return {String}
		 */
		cleanString: function(string){
			return string.replace(/\'/g, "");
		}
	});
});
	