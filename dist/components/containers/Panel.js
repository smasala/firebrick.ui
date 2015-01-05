/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Panel.html","./Base","../nav/Toolbar","../common/mixins/Toolbars"],function(e){return Firebrick.define("Firebrick.ui.containers.Panel",{extend:"Firebrick.ui.containers.Base",mixins:"Firebrick.ui.common.mixins.Toolbars",uiName:"fb-ui-panel",tpl:e,title:"",panelClass:!0,panelTypeClass:"default",panelHeaderClass:!0,panelBodyClass:!0,showPanelHeader:!0,content:"",contentTextual:!0,collapsible:!1,collapsed:!1,headerIcons:!1,headerIconPosition:"pull-right",toolbar:null,bindings:function(){var e=this,t=e.callParent(arguments);return t.css.panel=e.panelClass,e.panelTypeClass&&(t.css[e.parseBind("panel-"+e.panelTypeClass)]=!0),t},tabBindings:function(){var e=this,t={css:{},attr:{id:e.parseBind("fb-ui-collapse-"+e.getId())}};return e.collapsible&&(t.css["'panel-collapse'"]=e.collapsible,t.css.collapse=e.collapsible,e.collapsed||(t.css["in"]=!0)),t},panelHeaderBindings:function(){var e=this,t={css:{"'panel-heading'":e.panelHeaderClass},visible:e.showPanelHeader};return e.headerIcons&&(t.css.clearfix=!0),t},headerIconBindings:function(){var e=this,t={css:{"'btn-group'":!0}};return t.css[e.parseBind(e.headerIconPosition)]=!0,t},collapsibleLinkBindings:function(){var e=this,t="fb-ui-collapse-"+e.getId();return{attr:{"'data-toggle'":"'collapse'",href:e.parseBind("#"+t),"'aria-expanded'":typeof e.collapsed=="boolean"?e.collapsed:!0,"'aria-controls'":e.parseBind(t)}}},panelHeaderTextBindings:function(){var e=this,t={text:e.textBind(e.title),css:{}};return e.headerIcons&&(t.css["'pull-left'"]=!0),t},panelBodyBindings:function(){var e=this,t={css:{"'panel-body'":e.panelBodyClass}};return!e.items&&e.content&&(t.html=e.contentTextual?e.textBind(e.content):e.content),e.toolbarContainer(t),t}})});