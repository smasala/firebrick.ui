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
define(["doT"], function(tplEngine){

	"use strict";
	
	return Firebrick.define("Firebrick.ui.common.Base", {
		extend:"Firebrick.view.Base",
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
		 * variable shortcuts are created using the uiName. by default the string after the last "-" is used
		 * @example
		 * 		uiName:"fb-ui-input"
		 * 		//becomes accessible via: {Firebrick|fb}.ui.cmp.input
		 * 		//defining another component e.g "myapp-field-input" would overwrite the default input as "input" is found after the last "-"
		 * @property uiName
		 * @type {String}
		 * @default null
		 */
		uiName:null,
		/**
		 * called when defining the class
		 * @method constructor
		 * @return {Any} this.callParent(arguments)
		 */
		constructor: function(){
			var me = this,
				uiName = me.uiName;
			
			if(uiName){
				var n = uiName.substr(uiName.lastIndexOf("-")+1);
				//create variable
				Firebrick.ui.cmp[n] = uiName;
			}

			me.precompile();
			
			return me.callParent(arguments);
		},
		/**
		 * compile and cache template
		 * 
		 * @method _precompile
		 * @return {Object} self
		 */
		precompile: function(){
			var me = this;
			
			//init objects so each class is unqiue
			me._template = {};
			me._build = {};
			
			//precompile the template as soon as possible - performance
			//http://jsperf.com/dot-vs-handlebars/2
			if(me.tpl){
				me.template();	
			}
			if(me.subTpl){
				me.template("subTpl");	
			}
			return me;
		},
		/**
		 * use this as a wrapper in a template if the property you wish to call COULD be either a primitive or a function
		 * @method b
		 * @param value {String|Function}
		 * @return {String}
		 */
		b: function(value){
			return $.isFunction(value) ? value.bind(this)() : value;
		},
		/**
		 * when overriding this or any other method, this.callParent(arguments) calls the method in the super class
		 * @method init
		 */
		init: function(){
			var me = this;
			
			if(me.autoRender && me.getTarget()){
				me.tpl = me.build();
			}
			
			
			return this.callParent(arguments);
		},
		/**
		 * compile the template
		 * @method template
		 * @property prop {String} [prop=tpl] optional - name of property to template
		 * @property force {Boolean} [force=false] optional - set to true to force a retemplate
		 * @return {Function} template function
		 */
		template: function(prop, force){
			var me = this;
			prop = prop || "tpl";
			if(!me._template[prop] || force){
				me._template[prop] = tplEngine.template(me[prop]);
			}
			return me._template[prop];
		},
		/**
		 * build the compiled template
		 * @method build
		 * @property prop {String} [prop="tpl"] optional - name of property to build
		 * @return {String} html 
		 */
		build: function(prop){
			var me = this;
			prop = prop || "tpl";
			me._build[prop] = me._template[prop](me);
			return me._build[prop];
		},
		
		/**
		 * @method dataBind
		 * @param {String} [property=this.bindings]
		 * @private
		 * @return {String}
		 */
		dataBind: function(property){
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
			return tplEngine.template(me._getParent().tpl)(me);
		},
		/**
		 * called when calling {{{getParentSubTpl}}} in component template
		 * @method getParentSubTpl
		 * @return {String}
		 */
		getParentSubTpl: function(){
			var me = this;
			return tplEngine.template(me._getParent().subTpl)(me);
		},
		/**
		 * clean string - i.e. remove all ' from string
		 * @method cleanString
		 * @return {String}
		 */
		cleanString: function(string){
			return string.replace(/\'/g, "");
		},
		/**
		 * attach ' to the start and end of the string for KO binds
		 * @method parseBind
		 * @param  {String} str
		 * @return {String} "'" + str + "'"
		 */
		parseBind: function(str){
			return "'" + str + "'";
		}
	});
});
	