/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./SelectBox.html","jquery","./Input"],function(e,t){return Firebrick.define("Firebrick.ui.fields.SelectBox",{extend:"Firebrick.ui.fields.Input",uiName:"fb-ui-selectbox",multiSelect:!1,subTpl:e,data:!1,dataType:"select",selectedOptions:!1,optionsValue:"'value'",optionsText:"'text'",bindings:function(){var e=this,n=e.callParent(arguments),r=t.isFunction(e.data)?e.data():e.data;return n.attr.multiple=e.multiSelect,e.inplaceEdit?(n.editable=e.selectedOptions,n.editableOptions={optionsValue:e.optionsValue,optionsText:e.optionsText,options:r,type:e.parseBind(e.dataType)}):(n.options=r,n.selectedOptions=e.selectedOptions),n}})});