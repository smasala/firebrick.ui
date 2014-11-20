/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["handlebars","../display/List"],function(e){return Firebrick.define("Firebrick.ui.nav.List",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-navlist",preItemTpl:function(){return e.compile("<a data-bind=\"{{data-bind 'navLinkBindings'}}\">")(this)},postItemTpl:"</a>",navLinkBindings:function(){var e=this,t={attr:{href:"$data.link ? $data.link : ''"}};return t}})});