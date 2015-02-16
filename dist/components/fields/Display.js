/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Display.html","./Input"],function(e){return Firebrick.define("Firebrick.ui.fields.Display",{extend:"Firebrick.ui.fields.Input",uiName:"fb-ui-display",formControlClass:"form-control-static",subTpl:e,bindings:function(){var e=this,t=e.callParent(),n=t.value;return delete t.attr.readonly,delete t.attr.disabled,delete t.attr.type,delete t.attr.placeholder,delete t.value,t.text=n,t}})});