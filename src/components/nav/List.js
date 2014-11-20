/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class List
 */
define(["handlebars", "../display/List"], function(Handlebars){
	return Firebrick.define("Firebrick.ui.nav.List", {
		extend: "Firebrick.ui.display.List", 
		uiName:"fb-ui-navlist",
		/**
		 * overriding property from list
		 * @property preItemTpl
		 * @type {String}
		 * @default "<a data-bind="{{data-bind 'navLinkBindings'}}">"
		 */
		preItemTpl:function(){
			return Handlebars.compile('<a data-bind="{{data-bind \'navLinkBindings\'}}">')(this);
		},
		/**
		 * overriding property from list
		 * @property postItemTpl
		 * @type {String}
		 * @default "</a>"
		 */
		postItemTpl:"</a>",
		/**
		 * @method navLinkBindings
		 * @return {Object}
		 */
		navLinkBindings: function(){
			var me = this,
				obj = {
					attr:{
						href: "$data.link ? $data.link : ''"
					}
			};
			return obj;
		}
	});
})