/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./TabPanel.html","./Base","bootstrap.plugins/tab","./tab/Pane"],function(e){return Firebrick.define("Firebrick.ui.containers.TabPanel",{extend:"Firebrick.ui.containers.Base",tpl:e,uiName:"fb-ui-tabpanel",_getListTplId:function(){return"fb-ui-tpl-list-"+this.getId()},_getTabPaneTplId:function(){return"fb-ui-tpl-tabpane-"+this.getId()},_tabs:null,defaults:{uiName:fb.ui.cmp.tab.pane},bindings:function(){var e=this,t=e.callParent();return t.attr.role="'tabpanel'",t},listTemplateBindings:function(){var e=this,t={};return t.template={name:e.parseBind(e._getListTplId()),foreach:Firebrick.ui.helper.tabBuilder(e.getId()),as:"'tab'"},t},listBindings:function(){var e=this,t={css:{},attr:{}};return t.attr.role="'tablist'",t.css.nav=!0,t.css["'nav-tabs'"]=!0,t},listItemBindings:function(){var e=this,t={css:{},attr:{}};return t.attr.role="'presentation'",t.css.active="tab.hasOwnProperty('active') ? tab.active : false",t},listItemLinkBindings:function(){var e=this,t={css:{},attr:{}};return t.attr.href="Firebrick.ui.helper.linkBuilder(tab)",t.attr["'aria-controls'"]="tab.id",t.attr["'data-target'"]="Firebrick.getById('"+e.getId()+"').registerTab(tab.id, $index)",t.attr.role="'tab'",t.attr["'data-toggle'"]="'tab'",t},listItemTextBindings:function(){var e=this,t={css:{},attr:{}};return t.text=e.textBind("'+tab.title+'"),t},tabContentBindings:function(){var e=this,t={css:{},attr:{}};return t.css["'tab-content'"]=!0,t},registerTab:function(e,t){var n=this,r;return $.isFunction(t)&&(t=t()),r=e||"fb-ui-tab-"+n.getId()+"-"+t,n.addTab(r),"#"+r},addTab:function(e){var t=this;return t._tabs||(t._tabs=[]),t._tabs.push(e),t},getTabId:function(e){return this._tabs[e]},getTabPaneItem:function(e,t){var n=this,r;return t.paneIndex=e,r=n._getItems(t),r?(n.items[e]=r.items[0],r.html):""}})});