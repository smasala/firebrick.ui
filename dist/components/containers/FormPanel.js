/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Panel","./Form"],function(){return Firebrick.define("Firebrick.ui.containers.FormPanel",{extend:"Firebrick.ui.containers.Panel",formConfig:null,build:function(){var e=this,t=e.formConfig||{};return t.uiName=fb.ui.cmp.form,t.items=e.items,e.items=t,e.callParent(arguments)}})});