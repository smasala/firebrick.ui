/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Input"],function(){return Firebrick.define("Firebrick.ui.fields.DatePicker",{extend:"Firebrick.ui.fields.Input",sName:"fields.datepicker",inputAddon:!0,dateFormat:"dd/mm/yyyy",weekStart:1,datePickerOptions:function(){var e=this;return{autoclose:!0,weekStart:e.weekStart,format:e.dateFormat}},iconClass:"glyphicon-calendar",clickableIcon:!0,init:function(){var e=this;return e.on("rendered",function(){var t=e.getElement(),n,r;t.length&&t.datepicker(e.datePickerOptions()),e.inputAddon&&e.clickableIcon&&(n=t.siblings("."+e.inputAddonClass),n.length&&(r=n.find("."+e.iconClass),r.length&&(r.css("cursor","pointer"),r.on("click",function(){var e="fb-date-open";t.prop(e)===!0?(t.datepicker("hide"),t.prop(e,!1)):(t.prop(e,!0),t.focus())}))))}),e.callParent(arguments)},value:function(){var e=new Date;return"'"+("0"+e.getDate()).slice(-2)+"/"+e.getMonth()+1+"/"+e.getFullYear()+"'"}()})});