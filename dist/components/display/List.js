/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./List.html","knockout","jquery","../common/Base","../common/mixins/Items","../common/mixins/Badges"],function(e,t,n){return t.bindingHandlers.listRenderer||(t.virtualElements.allowedBindings.listRenderer=!0,t.bindingHandlers.listRenderer={init:function(e,r,i,s,o){var u=t.virtualElements.childNodes(e),a,f;for(var l=0,c=u.length;l<c;l++)a=u[l],a instanceof HTMLUListElement&&n(a).attr("id",r())}}),t.bindingHandlers.listItemRenderer||(t.bindingHandlers.listItemRenderer={init:function(e,t,r,i,s){var o=n(e);o.length&&i&&i.css&&o.addClass(Firebrick.ui.utils.getValue(i.css))}}),Firebrick.define("Firebrick.ui.display.List",{extend:"Firebrick.ui.common.Base",mixins:["Firebrick.ui.common.mixins.Items","Firebrick.ui.common.mixins.Badges"],sName:"display.list",tpl:e,listType:"ul",listGroup:!1,listItemGroupClass:!0,data:null,unstyled:!1,preItemTpl:"",postItemTpl:"",linkedList:!1,virtualContainerBindings:function(){return{"if":"$data && $data.length"}},externalLink:!1,bindings:function(){var e=this,t=e.callParent(arguments);return e.listGroup&&(t.css["'list-group'"]=e.listGroup),e.unstyled&&(t.css["'list-unstyled'"]=e.unstyled),e.items&&(t.foreach="$data"),t},listItemBindings:function(){var e=this,t={css:{},attr:{}};return e.listGroup&&e.listItemGroupClass&&(t.css["'list-group-item'"]=e.listItemGroupClass),t.css.divider="$data === '|' || $data.divider ? true : false",t.attr.id="$data.id || 'fb-ui-listitem-' + Firebrick.utils.uniqId()",t.listItemRenderer=!0,t},listItemTextBindings:function(){return{text:"$data.text ? $data.text : $data"}},listTemplateBindings:function(){var e=this;return{template:{name:e.parseBind(e._getTplId()),data:n.isArray(e.items)?"Firebrick.ui.getCmp('"+e.getId()+"').items":e.items},listRenderer:e.parseBind(e.getId())}},_getTplId:function(){return"fb-ui-tpl-"+this.getId()},childrenBindings:function(){var e=this;return{template:{name:e.parseBind(e._getTplId()),data:"$data.children"}}},listLinkBindings:function(){var e=this,t={attr:{href:"typeof $data.href === 'string' ? $data.href : 'javascript:void(0);'"}};return t.attr["'data-target'"]="$data.dataTarget ? $data.dataTarget : false",t.attr["'fb-ignore-router'"]="'externalLink' in $data ? $data.externalLink : "+e.externalLink,t}})});