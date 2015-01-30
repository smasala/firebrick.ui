/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./SelectBox.html","jquery","./Input"],function(e,t){return Firebrick.define("Firebrick.ui.fields.SelectBox",{extend:"Firebrick.ui.fields.Input",uiName:"fb-ui-selectbox",multiSelect:!1,subTpl:e,options:!1,dataType:"select",selectedOptions:!1,optionsValue:"'value'",optionsText:"'text'",bindings:function(){var e=this,t=e.callParent(arguments);return t.attr.multiple=e.multiSelect,e.inplaceEdit?(t.editable=e.selectedOptions,t.editableOptions={optionsValue:e.optionsValue,optionsText:e.optionsText,options:Firebrick.ui.helper.optionString(e),type:e.parseBind(e.dataType)}):(t.options=Firebrick.ui.helper.optionString(e),t.selectedOptions=e.selectedOptions,t.optionsText=e.optionsText,t.optionsValue=e.optionsValue),t}})});