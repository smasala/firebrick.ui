/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Panel","./Form"],function(){"use strict";return Firebrick.define("Firebrick.ui.containers.FormPanel",{extend:"Firebrick.ui.containers.Panel",sName:"containers.formpanel",formConfig:null,init:function(){var e=this,t=e.formConfig||{};return t.sName="containers.form",e.items?t.items=e.items:t.html=e.html,e.items=[t],e.callParent(arguments)}})});