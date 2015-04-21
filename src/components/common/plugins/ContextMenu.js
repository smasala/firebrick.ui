/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module plugins
 * @namespace plugins
 * @class ContextMenu
 */
(function(factory) {
	"use strict";
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["jquery", "text!./ContextMenu.html", "../mixins/Items"], factory);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.jQuery);
    }
})(function($, tpl) {
	"use strict";
	
	Firebrick.define("Firebrick.ui.common.plugins.ContextMenu", {
		extend: "Firebrick.ui.common.Base",
		mixins:"Firebrick.ui.common.mixins.Items",
		target: "body",
		tpl: tpl,
		enclosedBind: true,
		appendTarget: true,
		
		contextMenuEvent: null,
		
		
		init: function(){
			var me = this;
			
			me.on("rendered", function(){
				var el = me.getElement(),
					event = me.contextMenuEvent,
					$t = $(event.target),
					currentZ = $t.css("z-index"),
					zIndex;

				if(typeof currentZ === "string"){
					//currentZ is Auto
					zIndex = 1;
				}else{
					zIndex = currentZ+1;
				}
				
				el.css({
					position: "absolute",
					"z-index": zIndex,
					top: event.clientY,
					left: event.clientX,
					display: "block"
				});
				
			});
			
			return me.callParent(arguments);
		},
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.css["'fb-ui-contextmenu'"] = true;
			obj.css["'dropdown-menu'"] = true;
			
			obj.style = obj.style || {};
			obj.style.display = "'block'";
			
			obj.attr.role = "'menu'";
			
			return obj;
		}
	});
	
	//jquery plugin to init editable table
	$.fn.ContextMenu = function(clazz){
		var element = $(this);
		
		element.on("contextmenu", function(event){
			var plugin,
				globalClick = function(e){
					var $e = $(e.target),
						$el = plugin.getElement();
					if(!$el.is($e) && !$el.has($e).length){
						plugin.destroy();
						$(document).off("click", globalClick);	
					}
					
				};
			
			event.preventDefault();
			
			plugin = Firebrick.create("Firebrick.ui.common.plugins.ContextMenu", {
				contextMenuEvent: event,
				items: clazz.contextMenu
			});	//create Plugin Class instance
			
			$(document).on("click", globalClick);
		});
		
	};
	
});