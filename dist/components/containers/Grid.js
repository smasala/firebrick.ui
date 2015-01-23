/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Grid.html","jquery","./Base","./GridColumn"],function(e,t){return Firebrick.define("Firebrick.ui.containers.Grid",{extend:"Firebrick.ui.containers.Base",uiName:"fb-ui-grid",tpl:e,rowClass:!0,bindings:function(){var e=this,t=e.callParent(arguments);return t.css.row=e.rowClass,t},getBasicBindings:function(){var e=this,t={css:{}};return t.css[e.parseBind("col-md-"+Math.floor(12/e.items.length))]=!0,t},getGridItem:function(e,t){var n=this,r=n._getItems(t);return r?(n.items[e]=r.items[0],r.html):""}})});