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
		 * false to hide badge, string to show text
		 * @property badge
		 * @type {String|False}
		 * @default false
		 */
		badge: false,
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
					text: me.textBind( me.badge )
				};
			return obj;
		}
	});
});