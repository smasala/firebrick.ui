/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../display/List"],function(){"use strict";return Firebrick.define("Firebrick.ui.nav.Pagination",{extend:"Firebrick.ui.display.List",sName:"nav.pagination",preNode:!1,linkedList:!0,paginationSize:null,bindings:function(){var e=this,t=e.callParent(arguments);return t.css.pagination=!0,e.paginationSize&&(t.css[e.parseBind("pagination-"+e.paginationSize)]=!0),t},setActive:function(e){var t=this,n=t.getElement(),r=t.getActive(),i=$("a[data-value='"+e+"']",n).parent("li");r.removeClass("active"),i.addClass("active")},getActive:function(){var e=this,t=e.getElement();return $("li.active",t)}})});