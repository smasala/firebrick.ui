/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./TextArea","summernote"],function(){return Firebrick.define("Firebrick.ui.fields.HtmlEditor",{extend:"Firebrick.ui.fields.TextArea",sName:"fields.htmleditor",editorConf:null,getEditorConfig:function(){var e=this,t=e.editorConf||{},n={height:200};return Firebrick.utils.overwrite(n,t)},_setValue:function(e){return me.getElement().code(e)},getValue:function(){return me.getElement().code()},init:function(){var e=this;return e.inplaceEdit||(e.on("rendered",function(){e._initEditor()}),e.on("destroy",function(){e.getElement().destroy()})),e.callParent(arguments)},_initEditor:function(){var e=this,t=e.getElement();t.summernote(e.getEditorConfig())}})});