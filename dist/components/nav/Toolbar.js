/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Navbar"],function(){return Firebrick.define("Firebrick.ui.nav.Toolbar",{extend:"Firebrick.ui.nav.Navbar",uiName:"fb-ui-toolbar",showBranding:!1,position:"top",init:function(){var e=this;return e.navTypeClass="navbar-fixed-"+e.position,e.callParent(arguments)},navBindings:function(){var e=this,t=e.callParent(arguments);return t.css["'fb-ui-toolbar'"]=!0,t},navbarContainerBindings:function(){var e=this,t=e.callParent(arguments);return t.css["'navbar-nav'"]=!0,t},navbarWrapperBindings:function(){var e=this,t=e.callParent(arguments);return t.css.container&&delete t.css.container,t.css["'container-fluid'"]=!0,t}})});