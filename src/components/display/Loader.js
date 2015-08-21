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
define( [ "text!./Loader.html", "jquery", "../common/Base", "../common/mixins/Items" ], function( tpl, $ ) {
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
				obj.text = me.textBind( me.msgText );
			}
			
			return obj;
		}
	});
});
