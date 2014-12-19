/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Progress.html","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.display.Progress",{extend:"Firebrick.ui.common.Base",uiName:"fb-ui-progress",tpl:e,max:100,value:0,showLabel:!0,dataSymbol:"%",label:"",bindings:function(){var e=this,t=e.callParent(arguments);return t.attr.max=e.max,t.attr.value=e.value,t.text=e.parseBind(e.value+"%"),t},progressLabelBindings:function(){var e=this;return{css:{"'progress-label'":!0},attr:{"'data-symbol'":e.parseBind(e.dataSymbol),"'data-value'":e.value},text:e.textBind(e.label),style:{width:e.parseBind(e.value+"%")}}},progressContainerBindings:function(){return{css:{"'progress-container'":!0}}}})});