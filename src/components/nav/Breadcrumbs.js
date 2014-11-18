/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module ui.components
 * @extends ui.components.display.List
 * @namespace ui.components.nav
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