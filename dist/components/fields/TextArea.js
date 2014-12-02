/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./TextArea.html","./Input"],function(e){return Firebrick.define("Firebrick.ui.fields.TextArea",{extend:"Firebrick.ui.fields.Input",uiName:"fb-ui-textarea",rows:5,subTpl:e,dataType:"textarea"})});