/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["jquery"],function(e){return Firebrick.define("Firebrick.ui.common.mixins.Items",{items:null,listeners:{componentReady:function(){var t=this,n=t.items,r=arguments;if(e.isArray(n)){var i;for(var s=0,o=n.length;s<o;s++)i=n[s],i.passEvent&&i.passEvent(r)}}},getItems:function(){var t=this,n=t._getItems(t.items);return e.isPlainObject(n)&&(t.items=n.items),n?n.html||n:""},getItemsProp:function(e){var t=this;e=typeof e=="string"?t[e]:t.items;var n=t._getItems(e);return n?n.html||n:""},_getItems:function(t){var n=this;return t?(!e.isArray(t)&&!e.isFunction(t)&&(t=[t]),Firebrick.ui._populate(t,n)):null}})});