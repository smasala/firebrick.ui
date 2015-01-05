/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["doT","../display/List"],function(e){return Firebrick.define("Firebrick.ui.nav.List",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-navlist",unstyled:!0,linkedList:!0,navbarItem:!1,listLinkBindings:function(){var e={attr:{href:"$data.link ? $data.link : ''"}};return e},listContainerBindings:function(){var e=this,t=e.callParent(arguments);return e.navbarItem&&(t.css["'navbar-nav'"]=!0,t.css.nav=!0),t}})});