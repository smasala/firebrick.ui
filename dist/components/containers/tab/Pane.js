/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Pane.html","../Base","bootstrap.plugins/tab"],function(e){return Firebrick.define("Firebrick.ui.containers.tab.Pane",{extend:"Firebrick.ui.containers.Base",tpl:e,sName:"containers.tab.pane",active:!1,storeProp:"",html:"",getTab:function(){return this._parent},paneIndex:0,getPaneId:function(){var e=this,t=e.getTab();return t.getTabId(e.paneIndex)},bindings:function(){var e=this,t=e.callParent();return t.attr.role="'tabpanel'",t.css["'tab-pane'"]=!0,t.css.active=e.active,t.attr.id="Firebrick.getById('"+e.getId()+"').getPaneId()",e.items||(e.storeProp?t.html=e.storeProp:t.html="Firebrick.getById('"+e.getId()+"').html"),t}})});