/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["jquery"],function(e){"use strict";return Firebrick.define("Firebrick.ui.common.mixins.Items",{defaults:1,itemsAlign:null,items:null,getItems:function(){var e=this,t=e._getItems(e.items);return e.items=t.items,t.html},getItemsProp:function(e){var t=this,n,r="";return e?(n=t._getItems(t[e]),t[e]=n.items,r=n.html):console.error("invalid function call getItemsProp():",e),r},_getItems:function(e){return Firebrick.ui._populate(e,this)}})});