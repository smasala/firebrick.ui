/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Button.html","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.button.Button",{extend:"Firebrick.ui.common.Base",uiName:"fb-ui-button",tpl:e,text:"",btnSize:!1,btnStyle:"default",bindings:function(){var e=this,t={type:"button",text:"fb.text('"+e.text+"')",css:{"'btn'":!0}};return e.btnStyle&&(t.css["'btn-"+e.btnStyle+"'"]=!0),e.btnSize&&(t.css["'btn-"+e.btnSize+"'"]=!0),t}})});