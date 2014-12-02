/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Grid.html","jquery","./Base"],function(e,t){return Firebrick.define("Firebrick.ui.containers.Grid",{extend:"Firebrick.ui.containers.Base",uiName:"fb-ui-grid",tpl:e,rowClass:!0,bindings:function(){var e=this;return{css:{row:e.rowClass}}},getBasicBindings:function(){var e=this;return obj={css:{}},obj.css[e.parseBind("col-md-"+Math.floor(12/e.items.length))]=!0,obj},getGridItem:function(e,n,r){var i=r._getItems(n);return i?(r.items[e]=i.items[0],t.isPlainObject(n)?i.html:'<div data-bind="'+Firebrick.ui.utils.stringify(r.getBasicBindings())+'">'+i.html+"</div>"):""}})});