/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./ButtonGroup.html","./Base"],function(e){return Firebrick.define("Firebrick.ui.button.ButtonGroup",{extend:"Firebrick.ui.button.Base",uiName:"fb-ui-buttongroup",tpl:e,defaults:{uiName:"fb-ui-button",dropdownContainerClass:"btn-group"},vertical:!0,role:"group",groupSize:"md",arialLabel:"",bindings:function(){var e=this,t=e.callParent(arguments);return e.vertical?t.css["'btn-group-vertical'"]=!0:t.css["'btn-group'"]=!0,t.css[e.parseBind("btn-group-"+e.groupSize)]=!0,t.attr.role=e.parseBind(e.role),t.attr["'aria-label'"]=e.textBind(e.arialLabel),t}})});