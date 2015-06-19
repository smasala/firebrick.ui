/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./SelectBox.html","jquery","./Input"],function(e,t){return Firebrick.define("Firebrick.ui.fields.SelectBox",{extend:"Firebrick.ui.fields.Input",sName:"fields.selectbox",multiSelect:!1,subTpl:e,options:!1,type:"select",selectedOptions:!1,optionsValue:"'value'",optionsText:"'text'",bindings:function(){var e=this,t=e.callParent(arguments);return e.inplaceEdit||(t.options=Firebrick.ui.helper.optionString(e),t.selectedOptions=e.selectedOptions,t.optionsText=e.optionsText,t.optionsValue=e.optionsValue,t.attr.multiple=e.multiSelect),t}})});