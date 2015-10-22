/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./tpl/Label.html"],function(e){"use strict";return Firebrick.define("Firebrick.ui.common.mixins.Label",{labelTpl:e,labelCSS:"",labelText:"",getLabelTpl:function(){var e=this;return e.template("labelTpl"),e.build("labelTpl")},labelStyle:"default",labelBindings:function(){var e=this,t={text:e.textBind("labelText"),css:{label:!0}};return e.labelStyle&&(t.css[e.parseBind("label-"+e.labelStyle)]=!0),e.labelCSS&&(t.css[e.parseBind(e.labelCSS)]=!0),t}})});