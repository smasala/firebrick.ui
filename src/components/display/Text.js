/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Text
 */
define( [ "text!./Text.html", "../common/Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Text", {
		extend: "Firebrick.ui.common.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "display.text",
		/**
		 * @property tpl
		 * @type {String}
		 */
		tpl: tpl,
		/**
		 * @property html
		 * @type {String}
		 * @default false
		 */
		html: false,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text: "",
		/**
		 * @property leadCSS
		 * @type {Boolean}
		 * @default false
		 */
		leadCSS: false,
		/**
		 * @property blockQuote
		 * @type {Boolean}
		 * @default false
		 */
		blockQuote: false,
		/**
		 * @property blockQuoteReverseCSS
		 * @type {Boolean}
		 * @default false
		 */
		blockQuoteReverseCSS: false,
		/**
		 * false not to show, string for footer text
		 * @property blockQuoteFooter
		 * @type {Boolean|String}
		 * @default false
		 */
		blockQuoteFooter: false,
		/**
		 * @property isBlockQuoteFooterHTML
		 * @type {Boolean}
		 * @default false
		 */
		isBlockQuoteFooterHTML: false,
		/**
		 * false || string :: 'left', 'center', 'right', 'justify', 'no-wrap' (defaults to: left)
		 * @property textAlignment
		 * @type {Boolean|String}
		 * @default ""
		 */
		textAlignment: "",
		/**
		 * Bindings
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.css.lead = me.leadCSS;
			
			if ( me.textAlignment ) {
				obj.css[ me.parseBind( "text-" + me.textAlignment ) ] = true;
			}
			
			if ( me.isHtml ) {
				obj.html = "Firebrick.getById('" + me.getId() + "').html";
			} else if ( me.text ) {
				obj.text = me.textBind( "text" );
			}
			
			return obj;
		},
		/**
		 * @method blockQuoteBindings
		 * @return {Object}
		 */
		blockQuoteBindings: function() {
			return {
				css: {
					"'blockquote-reverse'": this.blockQuoteReverseCSS
				}
			};
		},
		/**
		 * @method blockQuoteFooterBindings
		 * @return {Object}
		 */
		blockQuoteFooterBindings: function() {
			var me = this,
				obj = {};
			if ( me.html ) {
				obj.html = "Firebrick.getById('" + me.getId() + "')['blockQuoteFooter']";
			} else {
				obj.text = me.textBind( "blockQuoteFooter" );
			}
			return obj;
		}
	});
});
