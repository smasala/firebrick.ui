/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Input"],function(){return Firebrick.define("Firebrick.ui.fields.DatePicker",{extend:"Firebrick.ui.fields.Input",dateFormat:"dd/mm/yyyy",weekStart:1,datePickerOptions:null,iconClass:"glyphicon-calendar",init:function(){var e=this;return e.on("rendered",function(){var t=e.getElement(),n=e.datePickerOptions;$.isPlainObject(n)||(n={}),n.weekStart=e.weekStart,n.format=e.dateFormat,t.length&&t.datepicker(n)}),e.callParent(arguments)},uiName:"fb-ui-datepicker",inputAddon:!0,value:function(){var e=new Date;return"'"+("0"+e.getDate()).slice(-2)+"/"+e.getMonth()+1+"/"+e.getFullYear()+"'"}()})});