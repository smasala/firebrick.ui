/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Modal.html","./Base"],function(e){"use strict";return Firebrick.define("Firebrick.ui.containers.Modal",{extend:"Firebrick.ui.containers.Base",tpl:e,target:"body",appendTarget:!0,sName:"containers.modal",init:function(){var e=this;return e.on("rendered",function(){e.showOnCreate&&e.showMe(),e.getElement().on("hidden.bs.modal",function(){e.destroy()})}),e.callParent(arguments)},enclosedBind:!0,_modalEl:null,getModalEl:function(){var e=this;return e._modalEl||(e._modalEl=$("> .modal",e.getElement())),e._modalEl},showMe:function(){var e=this;e.getModalEl().modal()},ariaDescribedBy:"",showOnCreate:!0,title:"",html:"",titleClass:!0,bodyClass:!0,animationClass:"fade",dialogClass:!0,contentClass:!0,headerClass:!0,isModal:!0,footerClass:!0,footerItems:null,titleSize:4,showCloseIcon:!0,srCloseText:"Close",srCloseIconBindings:function(){var e=this;return{css:{"'sr-only'":!0},text:e.parseBind(e.srCloseText)}},closeButtonBindings:function(){return{attr:{type:"'button'","'data-dismiss'":"'modal'"},css:{close:!0}}},getTitleId:function(){return"fb-modal-title-"+this.getId()},bindings:function(){var e=this,t=this.callParent();return t.css.modal=e.isModal,t.attr["'aria-labelledby'"]=e.parseBind(e.getTitleId()),t.attr["'aria-describedby'"]=e.parseBind(e.ariaDescribedBy),t.attr.role="'dialog'",t.attr.tabindex=-1,t.attr["'aria-hidden'"]=!0,e.animationClass&&(t.css[e.animationClass]=!0),t},dialogBindings:function(){var e=this;return{css:{"'modal-dialog'":e.dialogClass}}},contentBindings:function(){var e=this;return{css:{"'modal-content'":e.contentClass}}},headerBindings:function(){var e=this;return{css:{"'modal-header'":e.headerClass}}},titleBindings:function(){var e=this;return{text:e.textBind("title"),css:{"'modal-title'":e.titleClass}}},bodyBindings:function(){var e=this,t={css:{"'modal-body'":e.bodyClass}};return e.items||(t.html="Firebrick.ui.helper.getHtml( '"+e.getId()+"', $data, $context )"),t},footerBindings:function(){var e=this;return{css:{"'modal-footer'":e.footerClass}}},close:function(){var e=this;e.getModalEl().modal("hide")}})});