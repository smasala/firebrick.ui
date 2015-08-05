/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Item.html","../common/Base"],function(e){"use strict";return Firebrick.define("Firebrick.ui.menu.Item",{extend:"Firebrick.ui.common.Base",mixins:"Firebrick.ui.common.mixins.Items",sName:"menu.item",text:null,value:null,href:null,divider:!1,tpl:e,defaults:{sName:"menu.item"},bindings:function(){var e=this,t=e.callParent(arguments);return e.divider&&(t.css.divider=!0),t.attr.role="'presentation'",t},linkBindings:function(){var e=this,t={attr:{}};return e.href&&(t.href=e.href),e.text&&(t.text=e.textBind(e.text)),t.attr.role="'menuitem'",t.attr.tabindex="-1",t}})});