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
define( [ "doT", "jquery", "bootstrap.plugins/tooltip", "bootstrap.plugins/popover" ], function( tplEngine, $ ) {

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
						bindObj.attr.title = me.textBind( me.tooltip || me.popoverTitle );
					}
					if ( me.popover ) {
						bindObj.attr[ "'data-content'" ] = me.textBind( me.popover );
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
		 * @param key {String}
		 * @return {String}
		 */
		textBind: function( key ) {
			return "Firebrick.text('" + key + "')";
		}
	});
});
	