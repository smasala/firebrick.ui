/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../display/List"],function(){return Firebrick.create("Firebrick.ui.display.Pagination",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-pagination",paginationSize:null,listContainerBindings:function(){var e=this,t=this.callParent();return t.css.pagination=!0,e.paginationSize&&(t.css["'pagination-"+e.paginationSize+"'"]=!0),t}})});