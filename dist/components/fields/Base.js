/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["../common/Base"],function(){"use strict";return Firebrick.define("Firebrick.ui.fields.Base",{extend:"Firebrick.ui.common.Base",sName:"fields.base",fireEvent:function(){var e=this,t=e.getElement(),n=Firebrick.utils.argsToArray(arguments),r=n[0];return t&&(n.splice(0,1),t.trigger("fb.ui."+r,n)),e.callParent(arguments)}})});