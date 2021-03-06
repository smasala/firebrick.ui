/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Menu.html","../common/Base","../common/mixins/Items","./Item"],function(e){"use strict";return Firebrick.define("Firebrick.ui.menu.Menu",{extend:"Firebrick.ui.common.Base",mixins:"Firebrick.ui.common.mixins.Items",sName:"menu.menu",tpl:e,defaults:{sName:"menu.item"},ariaLabelledBy:"",init:function(){var e=this;return e._prepItems(),e.callParent(arguments)},_prepItems:function(){var e=this,t,n=e.items;for(var r=0,i=n.length;r<i;r++)t=n[r],t==="|"?t={divider:!0}:t.sName&&t.sName!=="menu.item"&&(t={items:[n[r]]}),n[r]=t},bindings:function(){var e=this,t=e.callParent(arguments);return t.css={"'dropdown-menu'":!0},t.attr||(t.attr={}),t.attr.role="'menu'",t.attr["'aria-labelledby'"]=e.parseBind(e.ariaLabelledBy),t}})});