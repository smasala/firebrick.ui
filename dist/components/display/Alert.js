/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Alert.html","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.display.Alert",{extend:"Firebrick.ui.common.Base",mixins:"Firebrick.ui.common.mixins.Items",tpl:e,uiName:"fb-ui-alert",dismissible:!0,animationClasses:"fade in",type:"danger",title:"",content:"",bindings:function(){var e=this,t=e.callParent(arguments);return t.attr.role="'alert'",t.css.alert=!0,t.css["'alert-dismissible'"]=e.dismissible,e.animationClasses&&(t.css[e.parseBind(e.animationClasses)]=!0),t.css[e.parseBind("alert-"+e.type)]=!0,t},srCloseText:"Close",srCloseIconBindings:function(){var e=this;return{css:{"'sr-only'":!0},text:e.parseBind(e.srCloseText)}},closeButtonBindings:function(){return{attr:{type:"'button'","'data-dismiss'":"'alert'"},css:{close:!0}}}})});