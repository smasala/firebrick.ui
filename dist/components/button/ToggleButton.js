/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./ToggleButton.html","knockout","jquery","../common/MultiplesBase"],function(e,t,n){var r=function(e){return n.isFunction(e)?e():e};return t.bindingHandlers.toggleRenderer||(t.bindingHandlers.toggleRenderer={init:function(e,t,i,s,o){var u=Firebrick.ui.getCmp(t()),a="btn-"+u.btnStyle,f=n(e),l=i().withProperties.inputItemId;l=r(l),f.length&&(s&&(s.btnStyle&&f.attr("class",function(e,t){return t.replace(a,"btn-"+r(s.btnStyle))}),s.css&&f.addClass(r(s.css))),f.attr("for",l),n("> input",f).attr("id",l))}}),Firebrick.define("Firebrick.ui.button.ToggleButton",{extend:"Firebrick.ui.common.MultiplesBase",uiName:"fb-ui-togglebutton",subTpl:e,btnGroupClass:!0,btnClass:!0,defaultActive:!1,dataToggle:"buttons",btnStyle:"default",btnSize:"md",options:"''",showLabel:!0,optionsRenderer:"optionsRenderer",btnGroupBindings:function(){var e=this;return{css:{"'btn-group'":e.btnGroupClass},attr:{"'data-toggle'":e.parseBind(e.dataToggle)},foreach:n.isArray(e.options)?"Firebrick.ui.getCmp('"+e.getId()+"').options":e.options}},toggleInputBindings:function(){var e=this;return{attr:{name:e.parseBind(e.name)},value:"$data.value || $data.text ? $data.value || $data.text : $data"}},toggleLabelBindings:function(){var e=this,t={attr:{id:"$data.labelId || 'fb-ui-id-' + Firebrick.utils.uniqId()"},withProperties:{inputItemId:"$data.id || 'fb-ui-id-' + Firebrick.utils.uniqId()"},css:{active:"Firebrick.ui.getCmp('"+e.getId()+"')._valueChecker("+e.value+", $data)"},toggleRenderer:e.parseBind(e.getId())};return e.btnClass&&(t.css.btn=!0),e.btnStyle&&(t.css[e.parseBind("btn-"+e.btnStyle)]=!0),e.btnSize&&(t.css[e.parseBind("btn-"+e.btnSize)]=!0),t},toggleLabelTextBindings:function(){return{text:"$data.text ? $data.text : $data"}}})});