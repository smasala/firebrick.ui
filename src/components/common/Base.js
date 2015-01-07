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
define(["doT", "firebrick"], function(tplEngine){

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
		 * all css classes (comma separated) are added to the standard bindings function
		 * @property css
		 * @type {String}
		 * @default null
		 */
		css: null,
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
		tooltip:false,
		/**
		 * where the tooltip should appear: "top", "left", "right", "bottom"
		 * @property tooltipLocation
		 * @type {String}
		 * @default "top"
		 */
		tooltipLocation:"top",
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
		popover:false,
		/**
		 * @property popoverTitle
		 * @type {Boolean|String} optional - set to false to deactivate, string to set the title
		 * @default false
		 */
		popoverTitle:false,
		/**
		 * where the popover should appear: "top", "left", "right", "bottom"
		 * @property popoverLocation
		 * @type {String}
		 * @default "top"
		 */
		popoverLocation:"top",
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
		 * pass a binding Object and this method will add the tooltip/popover relevant properties
		 * @method addTooltipPopoverBind
		 * @param bindObj {Object}
		 * @return {Object} new Object
		 */
		addTooltipPopoverBind: function(bindObj){
			var me = this;
			if(me.tooltip || me.popover){
				if(bindObj && $.isPlainObject(bindObj)){
					if(!bindObj.attr){
						bindObj.attr = {};
					}
					bindObj.attr["'data-toggle'"] = me.parseBind( me.tooltip ? "tooltip" : "popover" );
					if(me.tooltip || me.popoverTitle){
						bindObj.attr.title = me.textBind(me.tooltip || me.popoverTitle);
					}
					if(me.popover){
						bindObj.attr["'data-content'"] = me.textBind(me.popover);
						bindObj.attr["'data-container'"] = "'body'";
						if(me.popoverDismissible){
							bindObj.attr["'data-trigger'"] = "'focus'";
						}
					}
					bindObj.attr["'data-placement'"] = me.parseBind(me.tooltipLocation || me.popoverLocation);
				}
			}
			return bindObj;
		},
		/**
		 * pass a binding Object and this method will add the popover relevant properties
		 * @method addPopoverBind
		 * @param bindObj {Object}
		 * @return {Object} new Object
		 */
		addPopoverBind: function(bindObj){
			var me = this;
			if(me.tooltip && bindObj && $.isPlainObject(bindObj)){
				if(!bindObj.attr){
					bindObj.attr = {};
				}
				bindObj.attr["'data-toggle'"] = "'popover'";
				bindObj.attr.title = me.textBind(me.popover);
				bindObj.attr["'data-placement'"] = me.parseBind(me.popoverLocation);
			}
			return bindObj;
		},
		/**
		 * @method getElement
		 * @return {Object} jquery element object
		 */
		getElement: function(){
			var me = this;
			if(!me._element){
				me._element = $("#" + me.getId());
				if(!me._element.length){
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
			
			if(me.tooltip){
				//require the plugin if needed
				require(["bootstrap.plugins/tooltip"], function(){
					var t = me.getElement();
					if(t){
						t.tooltip(me.tooltipOptions);
					}
				});
			}
			
			if(me.popover){
				//require the plugin if needed
				require(["bootstrap.plugins/tooltip", "bootstrap.plugins/popover"], function(){
					var t = me.getElement();
					if(t){
						t.popover(me.popoverOptions);
					}
				});
			}
			
			return me.callParent(arguments);
		},
		/**
		 * @method _getCSSClasses
		 * @private
		 * @return {Object}
		 */
		_getCSSClasses: function(){
			var me = this,
				obj = {},
				classes;
			
			if(me.css){
				classes = me.css.split(",");
				if(classes.length){
					for(var i = 0, l = classes.length; i<l; i++){
						obj[me.parseBind(classes[i])] = true;
					}
				}
			}
			
			return obj;
		},
		/**
		 * mother of all basic bindings
		 * @method bindings
		 * @return {Object} {attr:{}, css:{}}
		 */
		bindings: function(){
			var me = this,
				obj = {
					attr:{},
					css:me._getCSSClasses()
				};
			
			return me.addTooltipPopoverBind(obj);
		},
		/**
		 * compile the template
		 * @method template
		 * @param prop {String} [prop=tpl] optional - name of property to template
		 * @param force {Boolean} [force=false] optional - set to true to force a retemplate
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
		 * @param prop {String} [prop="tpl"] optional - name of property to build
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
			var me = this,
				prop = property ? me[property] : me.bindings;
			if($.isFunction(prop)){
				prop = prop.call(me);
			}
			return Firebrick.ui.utils.stringify( prop );
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

			if(me._classname !== p._classname){
				if((me.subTpl !== p.subTpl) || (me.tpl !== p.tpl)){
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
		},
		/**
		 * takes a string and prepares it for Firebrick text call
		 * @example
		 * 	textBind("mystring.abc.key")
		 * 	// returns = fb.text('mystring.abc.key')
		 * @method textBind
		 * @param key {String}
		 * @return {String}
		 */
		textBind: function(key){
			return "fb.text('" + key + "')";
		}
	});
});
	