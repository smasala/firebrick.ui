/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Header
 */
define( [ "text!./Header.html", "../common/Base", "../common/mixins/Label" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Header", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Label",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "display.header",
		/**
		 * @property tpl
		 * @type {String}
		 */
		tpl: tpl,
		/**
		 * use to determine whether h1, h2, h3 etc - default = 1
		 * @property headerSize
		 * @type {Int}
		 * @default 1
		 */
		headerSize: 1,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text: "",
		/**
		 * @property secondaryText
		 * @type {String}
		 * @default ""
		 */
		secondaryText: "",
		/**
		 * change to a url if you wish to convert the header into a link
		 * @property href
		 * @type {String}
		 * @default null
		 */
		href: null,
		/**
		 * set to true to add attribute [fb-ignore-router=true] to all links - these links are then ignored by the history api (Firebrick.router.history)
		 * @property ignoreRouter
		 * @type {Boolean}
		 * @default true
		 */
		ignoreRouter: true,
		/**
		 * @method textBindings
		 * @return Object
		 */
		textBindings: function() {
			var me = this,
				obj = {};
			
			obj.text = me.textBind( "text" );
			
			return obj;
		},
		/**
		 * @method secondaryTextBindings
		 * @return Object
		 */
		secondaryTextBindings: function() {
			var me = this;
			if ( me.secondaryText ) {
				return {
					text: me.textBind( "secondaryText" )
				};
			} else {
				return {
					visible: false
				};
			}
		},
		/**
		 * @method hrefBindings
		 * @return {Object}
		 */
		hrefBindings: function() {
			var me = this,
				obj = { attr: {} };
			obj.attr[ "'fb-ignore-router'" ] = "$data.hasOwnProperty( 'ignoreRouter' ) ? $data.ignoreRouter : " + me.ignoreRouter;
			return obj;
		}
		
	});
});
