/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../fields/Input"],function(e){return Firebrick.define("Firebrick.ui.common.MultiplesBase",{extend:"Firebrick.ui.fields.Input",fieldBindings:function(){var e=this;if(!e.inplaceEdit){var t={withProperties:{itemId:"'fb-ui-id-' + Firebrick.utils.uniqId()"},css:{}};return e.multiplesInline&&(t.css["'"+e.cleanString(e.type)+"-inline'"]=e.multiplesInline),t}return{}}})});