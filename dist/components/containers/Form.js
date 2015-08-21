/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Form.html","jquery","./Base"],function(e,t){"use strict";return Firebrick.define("Firebrick.ui.containers.Form",{extend:"Firebrick.ui.containers.Base",sName:"containers.form",tpl:e,formRole:"form",horizontal:!0,html:"",inline:!1,enctype:"application/x-www-form-urlencoded",showProgress:!0,ajaxProcessData:!1,url:"/",submitType:"post",catchProgress:!1,preSubmit:function(e){e.preventDefault()},formTarget:null,xhr:function(){var e=this,t=new window.XMLHttpRequest;return t.upload.addEventListener("progress",function(t){if(t.lengthComputable){var n=t.loaded/t.total;e.catchProgress&&e.fireEvent("progressChanged",n)}},!1),t.addEventListener("progress",function(t){if(t.lengthComputable){var n=t.loaded/t.total;e.catchProgress&&e.fireEvent("progressChanged",n)}},!1),t},success:function(){console.info("success",arguments)},error:function(){console.warn("error",arguments)},complete:function(){},always:function(){},beforeSend:function(){},getFormData:function(){var e=this;return new window.FormData(e.getElement())},init:function(){var e=this;return e.on("rendered",function(){var t=e.getElement();t&&t.on("submit",function(){e.preSubmit.apply(e,arguments)!==!1&&e.submit()})}),e.callParent(arguments)},submit:function(){var e=this,n=e.getElement();if(!e.url||typeof e.url!="string"){console.error("unable to submit form. No url is set or is set incorrectly",e.url,e);return}if(!n){console.error("unable to submit form. Form not found for id",e.getId());return}window.FormData?t.ajax({xhr:e.xhr,url:e.url,type:e.submitType,data:new window.FormData(n[0]),processData:e.ajaxProcessData,contentType:e.enctype,beforeSend:e.beforeSend.bind(e),complete:e.complete.bind(e),success:e.success.bind(e),error:e.error.bind(e)}).always(e.always.bind(e)):console.error("FormData is not supported by your browser")},bindings:function(){var e=this,t=e.callParent(arguments);return t.attr.role=e.parseBind(e.formRole),t.attr.enctype=e.parseBind(e.enctype),t.css["'form-horizontal'"]=e.horizontal,t.css["'form-inline'"]=e.inline,t.attr.action="Firebrick.getById('"+e.getId()+"').url",t.attr.method=e.parseBind(e.submitType),e.formTarget&&(t.attr.target=e.parseBind(e.formTarget)),e.items||(t.html="Firebrick.ui.helper.getHtml( '"+e.getId()+"', $data, $context )"),t}})});