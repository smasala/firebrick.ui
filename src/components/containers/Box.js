/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Box
 */
define( [ "text!./Box.html", "./Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Box", {
		extend: "Firebrick.ui.containers.Base",
		tpl: tpl,
		sName: "containers.box",
		/**
		 * set as string to fill the div/box with html content
		 * @property html
		 * @type {String|false}
		 * @default false
		 */
		html: null,
		/**
		 * set as string to fill the div/box with text content
		 * @property text
		 * @type {String|false}
		 * @default false
		 */
		text: null,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				id = me.getId(),
				obj = me.callParent( arguments );
			if ( me.text ) {
				obj.text = "Firebrick.text( Firebrick.getById('" + id + "').text )";
			} else if ( me.html ) {
				obj.html = "Firebrick.getById('" + id + "').html";
			}
			return obj;
		}
	});
});
