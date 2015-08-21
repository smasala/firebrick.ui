/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Divider
 */
define( [ "text!./Divider.html", "../common/Base" ], function( tpl ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.display.Divider", {
		extend: "Firebrick.ui.common.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "display.divider",
		/**
		 * @property tpl
		 * @type {html}
		 */
		tpl: tpl
	});
});
