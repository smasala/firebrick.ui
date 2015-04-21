/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../display/List"],function(){return Firebrick.define("Firebrick.ui.nav.List",{extend:"Firebrick.ui.display.List",sName:"nav.list",unstyled:!0,linkedList:!0,navbarNavClass:!0,bindings:function(){var e=this,t=e.callParent(arguments);return e.navbarNavClass&&(t.css["'navbar-nav'"]=!0),t.css.nav=!0,t}})});