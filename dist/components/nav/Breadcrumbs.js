/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../display/List"],function(){return Firebrick.create("Firebrick.ui.display.Breadcrumbs",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-breadcrumbs",listType:"ol",listContainerBindings:function(){var e=this,t=this.callParent();return t.css.breadcrumb=!0,t}})});