/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["./Button"],function(){return Firebrick.define("Firebrick.ui.button.Icon",{extend:"Firebrick.ui.button.Button",sName:"button.icon",btnSize:"xs",text:!1,glyIcon:"remove",btnStyle:"danger",afterText:function(){var e=this;return e.text?e.text:""},buttonTextBindings:function(){var e=this,t=e.callParent(arguments);return t.hasOwnProperty("text")&&delete t.text,t.css||(t.css={}),t.css[e.glyphiconClass]=!0,t.css[e.parseBind("glyphicon-"+e.glyIcon)]=!0,t}})});