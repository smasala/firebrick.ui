/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Box.html","./Base"],function(e){"use strict";return Firebrick.define("Firebrick.ui.containers.Box",{extend:"Firebrick.ui.containers.Base",tpl:e,sName:"containers.box",html:null,text:null,bindings:function(){var e=this,t=e.getId(),n=e.callParent(arguments);return e.text?n.text="Firebrick.text( Firebrick.getById('"+t+"').text )":e.html&&(n.html="Firebrick.getById('"+t+"').html"),n}})});