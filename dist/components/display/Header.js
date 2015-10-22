/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Header.html","../common/Base","../common/mixins/Label"],function(e){"use strict";return Firebrick.define("Firebrick.ui.display.Header",{extend:"Firebrick.ui.common.Base",mixins:"Firebrick.ui.common.mixins.Label",sName:"display.header",tpl:e,headerSize:1,text:"",secondaryText:"",href:null,ignoreRouter:!0,textBindings:function(){var e=this,t={};return t.text=e.textBind("text"),t},secondaryTextBindings:function(){var e=this;return e.secondaryText?{text:e.textBind("secondaryText")}:{visible:!1}},hrefBindings:function(){var e=this,t={attr:{}};return t.attr["'fb-ignore-router'"]="$data.hasOwnProperty( 'ignoreRouter' ) ? $data.ignoreRouter : "+e.ignoreRouter,t}})});