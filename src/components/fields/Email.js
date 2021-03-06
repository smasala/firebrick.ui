/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class Email
 */
define( [ "./Input" ], function() {
	"use strict";
	return Firebrick.define( "Firebrick.ui.fields.Email", {
		extend: "Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.email",
		/**
		 * @property type
		 * @type {String}
		 * @default "'email'"
		 */
		type: "email",
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'text'"
		 */
		dataType: "text"
	});
});
