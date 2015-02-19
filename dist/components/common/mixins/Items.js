/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["jquery"],function(e){return Firebrick.define("Firebrick.ui.common.mixins.Items",{defaults:null,itemsAlign:null,items:null,getItems:function(){var t=this,n=t._getItems(t.items);return e.isPlainObject(n)&&(t.items=n.items),n?n.html||n:""},getItemsProp:function(e){var t=this,n;return e=typeof e=="string"?t[e]:t.items,n=t._getItems(e),n?n.html||n:""},_getItems:function(t){var n=this;if(t){!e.isArray(t)&&!e.isFunction(t)&&(t=[t]);if(n.defaults){Firebrick.utils.merge("defaults",n);for(var r=0,i=t.length;r<i;r++)t[r]=Firebrick.utils.copyover(t[r],n.defaults)}return Firebrick.ui._populate(t,n)}return null}})});