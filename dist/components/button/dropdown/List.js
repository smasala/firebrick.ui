/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../../nav/List"],function(){return Firebrick.define("Firebrick.ui.button.dropdown.List",{extend:"Firebrick.ui.nav.List",uiName:"fb-ui-dropdownlist",ariaLabelledBy:"",listContainerBindings:function(){var e=this,t=e.callParent(arguments);return t.css={"'dropdown-menu'":!0},t.attr||(t.attr={}),t.attr.role="'menu'",t.attr["'aria-labelledby'"]=e.parseBind(e.ariaLabelledBy),t},listItemBindings:function(){return{role:"'presentation'",css:{"'dropdown-submenu'":"$data.children && $data.children().length ? true : false"}}},listLinkBindings:function(){var e=this,t=e.callParent(arguments);return t.attr.role="'menuitem'",t.attr.tabindex="-1",t}})});