/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Text.html","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.display.Text",{extend:"Firebrick.ui.common.Base",uiName:"fb-ui-text",tpl:e,isHtml:!1,text:"",leadCSS:!1,blockQuote:!1,blockQuoteReverseCSS:!1,blockQuoteFooter:!1,isBlockQuoteFooterHTML:!1,textAlignment:"",bindings:function(){var e=this,t=e.callParent(arguments);return t.css.lead=e.leadCSS,e.textAlignment&&(t.css[e.parseBind("text-"+e.textAlignment)]=!0),e.isHtml?t.html=e.text:e.text&&(t.text=e.textBind(e.text)),t},blockQuoteBindings:function(){return{css:{"'blockquote-reverse'":this.blockQuoteReverseCSS}}},blockQuoteFooterBindings:function(){var e=this,t={};return e.isHtml?t.html=e.blockQuoteFooter:t.text=e.textBind(e.blockQuoteFooter),t}})});