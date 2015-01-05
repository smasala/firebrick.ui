/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @namespace components.common.mixins
 * @class Badges
 * @static
 */
define([], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.common.mixins.Badges", {
		/**
		 * show badge or not
		 * @property badge
		 * @type {Boolean}
		 * @default false
		 */
		badge: false,
		/**
		 * @property badgeText
		 * @type {String}
		 * @default ""
		 */
		badgeText:"",
		/**
		 * @method badgeBindings
		 * @return {Object}
		 */
		badgeBindings: function(){
			var me = this,
				obj = {
					attr:{},
					css:{
						badge: true
					},
					text: me.textBind( me.badgeText )
				};
			return obj;
		}
	});
});