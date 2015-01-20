/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Navbar.html","./Base","./List"],function(e){return Firebrick.define("Firebrick.ui.nav.Navbar",{extend:"Firebrick.ui.nav.Base",tpl:e,uiName:"fb-ui-navbar",defaults:{navbarItem:!0},navTypeClass:"navbar-static-top",navbarDefaultClass:!0,navbarClass:!0,navbarHeaderClass:!0,toggleButton:!0,toggleText:"Toggle navigation",brandClass:!0,brandLink:"/",brandText:"Firebrick.ui",brandTpl:!1,data:null,listGroupClass:!1,navClass:!0,showNavbarHeader:!0,showBranding:!0,navBindings:function(){var e=this,t={attr:{role:"'navigation'"},css:{"'navbar-default'":e.navbarDefaultClass,navbar:e.navbarClass}};return e.navTypeClass&&(t.css[e.parseBind(e.navTypeClass)]=!0),t},brandBindings:function(){var e=this,t={css:{},attr:{href:e.parseBind(e.brandLink)}};return e.brandClass&&(t.css["'navbar-brand'"]=e.brandClass),e.brandText&&!e.brandTpl&&(t.text=e.parseBind(e.brandText)),t},bindings:function(){var e=this,t=e.callParent(arguments);return t.text="$data.text ? $data.text : ''",t},listItemBindings:function(){return{css:{active:"$data.active ? $data.active : false"}}},navbarHeaderBindings:function(){var e=this,t={css:{}};return e.navbarHeaderClass&&(t.css["'navbar-header'"]=e.navbarHeaderClass),t},navbarContainerBindings:function(){var e=this,t={attr:{id:e.parseBind("fb-nav-"+e.getId())},css:{}};return e.toggleButton&&(t.css.collapse=!0,t.css["'navbar-collapse'"]=!0),t},toggleTextBindings:function(){var e=this;return{text:e.textBind(e.toggleText)}},toggleButtonBindings:function(){var e=this,t="fb-nav-"+e.getId()+"'",n={attr:{type:"'button'","'data-toggle'":"'collapse'","'data-target'":"'#"+t,"'aria-expanded'":!1,"'aria-controls'":"'"+t},css:{collapsed:!0,"'navbar-toggle'":!0}};return n},navbarWrapperBindings:function(){return{css:{container:!0}}}})});