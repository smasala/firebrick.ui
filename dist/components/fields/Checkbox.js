/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Radio"],function(){return Firebrick.define("Firebrick.ui.fields.Checkbox",{extend:"Firebrick.ui.fields.Radio",uiName:"fb-ui-checkbox",type:"checkbox",dataType:"checklist",bindings:function(){var e=this,t=e.callParent(arguments);return e.inplaceEdit&&(t.editable=e.selectedOptions||!1,t.editableOptions={optionsValue:"'value'",optionsText:"'text'",options:e.options,type:e.parseBind(e.dataType)}),t}})});