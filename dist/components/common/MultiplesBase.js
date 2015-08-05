/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["knockout-mapping","../fields/Input"],function(e){"use strict";return Firebrick.define("Firebrick.ui.common.MultiplesBase",{extend:"Firebrick.ui.fields.Input",fieldBindings:function(){var e=this,t=e.callParent(arguments);return e.inplaceEdit||(t.withProperties={itemId:"'fb-ui-id-' + Firebrick.utils.uniqId()"},e.multiplesInline&&(t.css||(t.css={}),t.css[e.parseBind(e.cleanString(e.type)+"-inline")]=e.multiplesInline)),t},_valueChecker:function(t,n){var r=this;e.isMapped(n)&&(n=e.toJS(n));if($.isPlainObject(n)){if(n.active)return $.isFunction(n.active)?n.active():n.active;if(n.checked)return $.isFunction(n.checked)?n.checked():n.checked;n.value&&(n=n.value)}return t?($.isFunction(t)&&(t=t()),t===n):r.defaultActive}})});