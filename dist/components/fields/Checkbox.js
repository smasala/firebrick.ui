/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Radio"],function(){"use strict";return Firebrick.define("Firebrick.ui.fields.Checkbox",{extend:"Firebrick.ui.fields.Radio",sName:"fields.checkbox",type:"checkbox",dataType:"checklist",bindings:function(){var e=this,t=e.callParent(arguments);return e.inplaceEdit&&(t.editable=e.selectedOptions||!1,t.editableOptions={optionsValue:e.parseBind(e.optionsPropValue),optionsText:e.parseBind(e.optionsPropText),options:e.options,type:e.parseBind(e.dataType)}),t}})});