/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Input"],function(){"use strict";return Firebrick.define("Firebrick.ui.fields.Hidden",{extend:"fields.input",sName:"fields.hidden",containerBindings:function(){var e=this,t=e.callParent(arguments);return t.css["'fb-ui-hidden-field'"]=!0,t}})});