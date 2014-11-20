/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["jquery","../common/Base"],function(e){return Firebrick.define("Firebrick.ui.containers.Base",{extend:"Firebrick.ui.common.Base",init:function(){var t=this;t.on("componentReady",function(){var n=t.items,r=arguments;e.isArray(n)&&e.each(n,function(e,t){t.passEvent&&!t.didit&&t.passEvent(r)})}),t.callParent()},getItems:function(){var t=this,n=t._getItems(t.items);return e.isPlainObject(n)&&(t.items=n.items),n?n.html||n:""},_getItems:function(t){var n=this;return t?(e.isArray(t)||(t=[t]),Firebrick.ui._populate(t,n)):null}})});