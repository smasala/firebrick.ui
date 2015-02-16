/*!
 * @author Steven Masala [me@smasala.com]
 */

define([],function(){return Firebrick.define("Firebrick.ui.common.mixins.Column",{deviceSize:"md",columnWidth:"auto",columnOffset:null,columnOrder:null,_getColumnWidth:function(){var e=this,t=e.columnWidth;return t==="auto"?Math.floor(12/e._parent.items.length):t},calColumn:function(e){var t=this;return e.css.col=!0,e.css[t.parseBind("col-"+t.deviceSize+"-"+t._getColumnWidth())]=!0,t.columnOffset&&(e.css[t.parseBind("col-"+t.deviceSize+"-offset-"+t.columnOffset)]=!0),t.columnOrder&&(e.css[t.parseBind("col-"+t.deviceSize+"-"+t.columnOrder)]=!0),e}})});