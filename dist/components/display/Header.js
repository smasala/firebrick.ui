/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Header.html","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.display.Header",{extend:"Firebrick.ui.common.Base",uiName:"fb-ui-header",tpl:e,headerType:1,text:"",secondaryText:"",labelText:"",labelCSS:"default",bindings:function(){return{text:"fb.text('"+this.text+"')"}},secondaryTextBindings:function(){var e=this;return e.secondaryText?{text:e.secondaryText}:{visible:!1}},labelBindings:function(){var e=this,t;return e.labelText?(t={text:e.labelText,css:{label:!0}},e.labelCSS&&(t.css[e.parseBind("label-"+e.labelCSS)]=!0),t):{visible:!1}}})});