/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Span.html","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.display.Span",{extend:"Firebrick.ui.common.Base",uiName:"fb-ui-span",tpl:e,text:"",bindings:function(){var e=this,t=e.callParent(arguments);return t.text="Firebrick.getById('"+e.getId()+"').text",t}})});