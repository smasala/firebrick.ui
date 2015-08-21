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
		 * set as string to fill the div/box with text content
		 * @property html
		 * @type {String|false}
		 * @default false
		 */
		html: false
	});
});
