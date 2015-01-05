/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./GridColumn.html","./Base"],function(e){return Firebrick.define("Firebrick.ui.containers.GridColumn",{extend:"Firebrick.ui.containers.Base",uiName:"fb-ui-gridcol",tpl:e,deviceSize:"md",columnWidth:"auto",_getColumnWidth:function(){var e=this,t=e.columnWidth;return t==="auto"?Math.floor(12/e._parent.items.length):t},bindings:function(){var e=this,t=e.callParent(arguments);return t.css.col=!0,t.css["'col-"+e.deviceSize+"-"+e._getColumnWidth()+"'"]=!0,t}})});