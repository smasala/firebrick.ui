/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Grid.html","jquery","./Base"],function(e,t){return Firebrick.create("Firebrick.ui.containers.Grid",{extend:"Firebrick.ui.containers.Base",uiName:"fb-ui-grid",tpl:e,rowClass:!0,bindings:function(){var e=this;return{css:{row:e.rowClass},attr:{id:"'"+e.getId()+"'"}}},getBasicBindings:function(){var e=this;return obj={css:{}},obj.css["'col-md-"+Math.floor(12/e.items.length)+"'"]=!0,obj},getGridItem:function(e,n,r){var i=r.data.root,s=i._getItems(n);return i.items[e]=s.items[0],t.isPlainObject(n)?s.html:'<div data-bind="'+Firebrick.ui.utils.stringify(i.getBasicBindings())+'">'+s.html+"</div>"}})});