/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../common/Base","../common/mixins/Items"],function(){"use strict";return Firebrick.define("Firebrick.ui.containers.Base",{extend:"Firebrick.ui.common.Base",mixins:"Firebrick.ui.common.mixins.Items",bindings:function(){var e=this,t=e.callParent(arguments);return e.itemsAlign&&(t.css[e.parseBind("fb-ui-items-align-"+e.itemsAlign)]=!0),t}})});