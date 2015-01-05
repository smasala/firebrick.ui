/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["doT","../display/List"],function(e){return Firebrick.define("Firebrick.ui.nav.List",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-navlist",unstyled:!0,linkedList:!0,listContainerBindings:function(){var e=this,t=e.callParent(arguments);return t.css["'navbar-nav'"]=!0,t.css.nav=!0,t}})});