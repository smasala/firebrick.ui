/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Panel","./Form"],function(){return Firebrick.define("Firebrick.ui.containers.FormPanel",{extend:"Firebrick.ui.containers.Panel",sName:"containers.formpanel",formConfig:null,build:function(){var e=this,t=e.formConfig||{};return t.sName="containers.form",t.items=e.items,e.items=t,e.callParent(arguments)}})});