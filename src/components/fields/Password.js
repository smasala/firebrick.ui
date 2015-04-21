/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class Password
 */
define(["./Input"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.Password", {
		extend:"Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-password"
		 */
		sName:"fields.password",
		/**
		 * @property type
		 * @type {String}
		 * @default "password"
		 */
		type:"password"
	});
});