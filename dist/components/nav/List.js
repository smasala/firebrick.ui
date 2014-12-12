/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["doT","../display/List"],function(e){return Firebrick.define("Firebrick.ui.nav.List",{extend:"Firebrick.ui.display.List",uiName:"fb-ui-navlist",unstyled:!0,preItemTpl:function(){return e.template("<a data-bind=\"{{=it.dataBind('navLinkBindings')}}\">")(this)},postItemTpl:"</a>",navLinkBindings:function(){var e={attr:{href:"$data.link ? $data.link : ''"}};return e}})});