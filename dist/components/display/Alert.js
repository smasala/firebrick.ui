/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Alert.html","../common/Base","../common/mixins/Items"],function(e){return Firebrick.define("Firebrick.ui.display.Alert",{extend:"Firebrick.ui.common.Base",mixins:"Firebrick.ui.common.mixins.Items",tpl:e,sName:"display.alert",dismissible:!0,animationClasses:"fade in",type:"danger",title:"",storeProp:"",html:"",bindings:function(){var e=this,t=e.callParent(arguments);return t.attr.role="'alert'",t.css.alert=!0,t.css["'alert-dismissible'"]=e.dismissible,e.animationClasses&&(t.css[e.parseBind(e.animationClasses)]=!0),t.css[e.parseBind("alert-"+e.type)]=!0,t},paragraphBindings:function(){var e=this,t={};return e.storeProp?t.html=e.storeProp:t.html="Firebrick.getById('"+e.getId()+"').html",t},srCloseText:"Close",srCloseIconBindings:function(){var e=this;return{css:{"'sr-only'":!0},text:e.parseBind(e.srCloseText)}},closeButtonBindings:function(){return{attr:{type:"'button'","'data-dismiss'":"'alert'"},css:{close:!0}}}})});