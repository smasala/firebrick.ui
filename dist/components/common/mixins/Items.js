/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["jquery"],function(e){return Firebrick.define("Firebrick.ui.common.mixins.Items",{items:null,listeners:{componentReady:function(){var t=this,n=t.items,r=arguments;e.isArray(n)&&e.each(n,function(e,t){t.passEvent&&t.passEvent(r)})}},getItems:function(){var t=this,n=t._getItems(t.items);return e.isPlainObject(n)&&(t.items=n.items),n?n.html||n:""},getItemsScoped:function(e,t){t=typeof t=="string"?e[t]:e.items;var n=e._getItems(t);return n?n.html||n:""},_getItems:function(t){var n=this;return t?(e.isArray(t)||(t=[t]),Firebrick.ui._populate(t,n)):null}})});