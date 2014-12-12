/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class List
 */
define(["doT", "../display/List"], function(tplEngine){
	"use strict";
	return Firebrick.define("Firebrick.ui.nav.List", {
		extend: "Firebrick.ui.display.List", 
		uiName:"fb-ui-navlist",
		unstyled:true,
		/**
		 * overriding property from list
		 * @property preItemTpl
		 * @type {String}
		 * @default "<a data-bind="{{data-bind 'navLinkBindings'}}">"
		 */
		preItemTpl:function(){
			return tplEngine.template('<a data-bind="{{=it.dataBind(\'navLinkBindings\')}}">')(this);
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
			var obj = {
					attr:{
						href: "$data.link ? $data.link : ''"
					}
			};
			return obj;
		}
	});
});