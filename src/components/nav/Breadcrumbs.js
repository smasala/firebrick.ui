/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.display.List
 * @namespace components.nav
 * @class Breadcrumbs
 */
define(["../display/List"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.nav.Breadcrumbs", {
		extend:"Firebrick.ui.display.List",
		sName:"nav.breadcrumbs",
		listType: "ol",
		linkedList:true,
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			obj.css.breadcrumb = true;
			return obj;
		}
	});
});