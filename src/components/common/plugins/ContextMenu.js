/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module plugins
 * @namespace plugins
 * @class ContextMenu
 */
define(["jquery", "text!./ContextMenu.html", "../mixins/Items"], function($, tpl){
	"use strict";
	
	return Firebrick.define("Firebrick.ui.common.plugins.ContextMenu", {
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
				me._initContext();
				me.position();
			});
			
			return me.callParent(arguments);
		},
		
		position: function(){
			var me = this,
				el = me.getElement(),
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
		},
		
		_initContext: function(){
			var me = this,
				globalClick = function(e){
					var $e = $(e.target),
						$el = me.getElement();
					if(!$el.is($e) && !$el.has($e).length){
						me.destroy();
						$(document).off("click", globalClick);	
					}
					
				};
				
			$(document).on("click", globalClick);
		},
		
		
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.css["'fb-ui-contextmenu'"] = true;
			
			obj.style = obj.style || {};
			obj.style.display = "'block'";
			
			obj.attr.role = "'menu'";
			
			return obj;
		}
	});
	
});