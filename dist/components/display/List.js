/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./List.html","../common/Base","../common/mixins/Badges"],function(e){return Firebrick.define("Firebrick.ui.display.List",{extend:"Firebrick.ui.common.Base",mixins:"Firebrick.ui.common.mixins.Badges",uiName:"fb-ui-list",tpl:e,listType:"ul",listGroup:!1,listItemGroupClass:!0,data:!1,unstyled:!1,preItemTpl:"",postItemTpl:"",linkedList:!1,virtualContainerBindings:function(){return{"if":"$data && $data.length"}},listContainerBindings:function(){var e=this,t={css:{}};return e.listGroup&&(t.css["'list-group'"]=e.listGroup),e.unstyled&&(t.css["'list-unstyled'"]=e.unstyled),e.data&&(t.foreach="$data"),t},listItemBindings:function(){var e=this,t={css:{}};return e.listGroup&&e.listItemGroupClass&&(t.css["'list-group-item'"]=e.listItemGroupClass),t},bindings:function(){var e=this,t=e.callParent(arguments);return t.text="$data.text ? $data.text : $data",t},listTemplateBindings:function(){var e=this;return{template:{name:e.parseBind(e.getId()),data:e.data}}},childrenBindings:function(){var e=this;return{template:{name:e.parseBind(e.getId()),data:"$data.children"}}},listLinkBindings:function(){var e={attr:{href:"$data.link ? $data.link : ''"}};return e}})});