/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Navbar"],function(){"use strict";return Firebrick.define("Firebrick.ui.nav.Toolbar",{extend:"Firebrick.ui.nav.Navbar",sName:"nav.toolbar",showBranding:!1,position:"top",init:function(){var e=this;return e.navTypeClass="navbar-fixed-"+e.position,e.callParent(arguments)},bindings:function(){var e=this,t=e.callParent(arguments);return t.css["'fb-ui-toolbar'"]=!0,t},navbarContainerBindings:function(){var e=this,t=e.callParent(arguments);return t.css["'navbar-nav'"]=!1,t.css["'fb-ui-navbar'"]=!0,t.css["'form-horizontal'"]=!0,t},navbarWrapperBindings:function(){var e=this,t=e.callParent(arguments);return t.css.container&&delete t.css.container,t.css["'container-fluid'"]=!0,t}})});