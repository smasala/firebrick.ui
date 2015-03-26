/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../display/List"],function(){return Firebrick.define("Firebrick.ui.nav.Breadcrumbs",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-breadcrumbs",listType:"ol",linkedList:!0,bindings:function(){var e=this,t=e.callParent(arguments);return t.css.breadcrumb=!0,t}})});