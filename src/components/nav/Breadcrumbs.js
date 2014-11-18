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
	return Firebrick.create("Firebrick.ui.display.Breadcrumbs", {
		extend:"Firebrick.ui.display.List",
		uiName:"fb-ui-breadcrumbs",
		listType: "ol",
		listContainerBindings: function(){
			var me = this,
				obj = this.callParent();
			obj.css.breadcrumb = true;
			return obj;
		}
	});
});