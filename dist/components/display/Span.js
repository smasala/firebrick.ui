/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Span.html","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.display.Span",{extend:"Firebrick.ui.common.Base",sName:"display.span",tpl:e,text:"",labelStyle:"",bindings:function(){var e=this,t=e.callParent(arguments);return t.text="Firebrick.getById('"+e.getId()+"').text",e.labelStyle&&(e.css.label=!0,e.css[e.parseBind("label-"+e.labelStyle)]=!0),t}})});