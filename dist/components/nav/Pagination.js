/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../display/List"],function(){return Firebrick.define("Firebrick.ui.nav.Pagination",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-pagination",paginationSize:null,bindings:function(){var e=this,t=e.callParent(arguments);return t.css.pagination=!0,e.paginationSize&&(t.css[e.parseBind("pagination-"+e.paginationSize)]=!0),t}})});