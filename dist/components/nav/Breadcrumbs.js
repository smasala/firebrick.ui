/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../display/List"],function(){return Firebrick.define("Firebrick.ui.display.Breadcrumbs",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-breadcrumbs",listType:"ol",bindings:function(){var e=this,t=e.callParent(arguments);return t.css.breadcrumb=!0,t}})});