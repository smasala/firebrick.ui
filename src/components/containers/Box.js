/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Box
 */
define(["text!./Box.html", "./Base"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.Box", {
		extend:"Firebrick.ui.containers.Base",
		tpl: tpl,
		uiName:"fb-ui-box",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			return {};
		}
	});
});