/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../fields/Input"],function(){return Firebrick.define("Firebrick.ui.common.MultiplesBase",{extend:"Firebrick.ui.fields.Input",fieldBindings:function(){var e=this,t=e.callParent(arguments);return e.inplaceEdit||(t.withProperties={itemId:"'fb-ui-id-' + Firebrick.utils.uniqId()"},e.multiplesInline&&(t.css||(t.css={}),t.css[e.parseBind(e.cleanString(e.type)+"-inline")]=e.multiplesInline)),t}})});