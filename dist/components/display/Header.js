/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Header.html","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.display.Header",{extend:"Firebrick.ui.common.Base",sName:"display.header",tpl:e,headerSize:1,text:"",secondaryText:"",labelText:"",labelStyle:"default",href:null,textBindings:function(){var e=this,t={};return t.text=e.textBind(e.text),t},secondaryTextBindings:function(){var e=this;return e.secondaryText?{text:e.textBind(e.secondaryText)}:{visible:!1}},labelBindings:function(){var e=this,t;return e.labelText?(t={text:e.textBind(e.labelText),css:{label:!0}},e.labelStyle&&(t.css[e.parseBind("label-"+e.labelStyle)]=!0),t):{visible:!1}},hrefBindings:function(){return{}}})});