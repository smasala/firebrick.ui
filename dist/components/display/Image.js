/*!
* @author Steven Masala [me@smasala.com]
*/

define(["text!./Image.html","../common/Base","responsive-images"],function(e){return Firebrick.define("Firebrick.ui.display.Image",{extend:"Firebrick.ui.common.Base",uiName:"fb-ui-image",tpl:e,init:function(){var e=this;e.on("rendered",function(){window.responsiveImages&&window.responsiveImages.update(e.getId())}),this.callParent(arguments)},src:"",sizes:"",srcset:"",responsiveClass:!0,imgType:"rounded",bindings:function(){var e=this,t=e.callParent(arguments);return t.css["'img-responsive'"]=e.responsiveClass,e.imgType&&(t.css[e.parseBind("img-"+e.imgType)]=!0),e.sizes&&(t.attr["'data-sizes'"]=e.sizes),e.srcset&&(t.attr["'data-srcset'"]=e.srcset),e.src&&(t.attr.src=e.src),t}})});