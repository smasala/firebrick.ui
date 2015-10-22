/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Button.html","./Base","../common/mixins/Badges","../menu/Menu"],function(e){"use strict";return Firebrick.define("Firebrick.ui.button.Button",{extend:"Firebrick.ui.button.Base",mixins:["Firebrick.ui.common.mixins.Badges"],sName:"button.button",tpl:e,text:"",type:"button",dropdownContainerClass:"dropdown",navbarItem:!1,splitButton:!1,btnSize:!1,disabled:!1,btnStyle:"default",beforeText:"",glyIcon:null,afterText:"",loadingText:!1,dropdownConfig:null,srOnlyText:"Toggle Dropdown",closeModal:!1,_dropdownParent:null,getDropdownParentEl:function(){var e=this,t;return e._dropdownParent||(t=e.getElement(),e._dropdownParent=t.parent()),e._dropdownParent},_dropdown:null,getDropdownEl:function(){var e=this,t;return e._dropdown||(t=e.getElement(),e._dropdown=t.siblings("ul.dropdown-menu")),e._dropdown},init:function(){var e=this;return e._initDropdown(),e.callParent(arguments)},_initDropdown:function(){var e=this;e.items&&e.items.length&&e.on("rendered",function(){var t=e.getDropdownParentEl();t.length&&t.on("shown.bs.dropdown",function(){e.positionDropdown()})})},positionDropdown:function(){var e=this,t=e.getElement(),n=e.getDropdownEl(),r=$(document).width(),i=t.offset(),s=i.left,o=n.outerWidth(),u=t.outerWidth(),a=o-u;o>u&&i.left+o>r&&(s=i.left-a),n.css({top:i.top+t.outerHeight(),left:s})},bindings:function(){var e=this,t=e.callParent(arguments);return t.attr.type=e.parseBind(e.type),t.css.btn=!0,t.attr.autocomplete="'off'",e.btnStyle&&(t.css[e.parseBind("btn-"+e.btnStyle)]=!0),e.btnSize&&(t.css[e.parseBind("btn-"+e.btnSize)]=!0),e.items&&!e.splitButton&&(t.css["'dropdown-toggle'"]=!0,t.attr["'data-toggle'"]="'dropdown'"),e.navbarItem&&(t.css["'navbar-btn'"]=!0),e.loadingText&&(t.attr["'data-loading-text'"]=e.textBind("loadingText")),e.closeModal&&(t.attr["'data-dismiss'"]="'modal'"),e.disabled&&(t.attr.disabled="'disabled'"),t},buttonTextBindings:function(){var e=this,t={css:{},text:e.textBind("text")};return e.glyIcon&&(t.css.glyphicon=!0,t.css[e.parseBind("glyphicon-"+e.glyIcon)]=!0),t},caretBindings:function(){return{css:{caret:!0}}},dropdownContainerBindings:function(){var e=this,t={css:{}};return e.splitButton?t.css["'btn-group'"]=!0:e.dropdownContainerClass&&!e.splitButton&&(t.css[e.parseBind(e.dropdownContainerClass)]=!0),t.css["'fb-ui-dropdown'"]=!0,t},getDropdown:function(){var e=this,t={sName:"menu.menu",items:e.items};return t=Firebrick.utils.copyover(t,e.dropdownConfig||{}),t=e._getItems(t),e.items=t.items,t.html},splitButtonBindings:function(){var e=this,t={css:{},attr:{}};return t.attr.type=e.parseBind(e.type),t.css.btn=!0,e.btnStyle&&(t.css[e.parseBind("btn-"+e.btnStyle)]=!0),e.btnSize&&(t.css[e.parseBind("btn-"+e.btnSize)]=!0),e.items&&(t.css["'dropdown-toggle'"]=!0,t.attr["'data-toggle'"]="'dropdown'"),t.attr["'aria-expanded'"]=!1,t},splitButtonSrOnlyBinding:function(){var e=this,t={css:{}};return t.css["'sr-only'"]=!0,t.text=e.textBind("srOnlyText"),t},setEnabled:function(e){var t=this,n=t.getElement();e?(n.removeAttr("disabled"),t.fireEvent("enabled")):(n.attr("disabled","disabled"),t.fireEvent("disabled"))}})});