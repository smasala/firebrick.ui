/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class BorderLayout
 */
define(["text!./BorderLayout.html", "./Base", "./Box", "./border/Pane"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.BorderLayout", {
		extend:"Firebrick.ui.containers.Base",
		/**
		 * @property tpl
		 * @type {String} html
		 * @default BorderLayout.html
		 */
		tpl: tpl,
		/**
		 * @property sName
		 * @type {String}
		 */
		sName:"containers.borderlayout",
		
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {
		 * 		sName: "containers.border.pane"
		 * }
		 */
		defaults: {
			sName: "containers.border.pane"
		},
		
		/**
		 * @example
		 * 		items:[{
		 * 			position: "top",	//top, right, bottom, left, center
		 * 			//GridCol properties...
		 * 			items:[{
		 * 				...
		 * 			}];
		 * 		}]
		 * @property items
		 * @type {Array of Objects}
		 * @default null
		 */
		items:null,
		
		/**
		 * number of cols in Bootstraps grid system
		 * do no alter this unless BS changes it
		 * @private
		 * @property _maxGridCols
		 * @type {Integer}
		 * @default 12
		 */
		_maxGridCols: 12,
		/**
		 * @property defaultSizes
		 * @type {Object}
		 * @default {
		 * 		top: 12,
		 * 		right: 3,
		 * 		bottom: 12,
		 * 		left: 3,
		 * 		center: 6
		 * }
		 */
		defaultSizes:{
			top: "100%",
			right: "33%",
			bottom: "100%",
			left: "33%"
		},
		/**
		 * 
		 * @property height
		 * @type {Integer|String} px value | auto | fit
		 * @default "auto"
		 */
		height: "fit",
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function(){
			var me = this,
				resize;
			
			me.on("rendered", function(){
				var el = me.getElement(),
					height = me.height;
				if(height === "fit"){
					//set a fixed height for the borderLayout so that the height
					//of the vertical panes grow in the correct direction
					el.css("height", el.parent().height());
					resize = function(){
						el.css("height", el.parent().height());
					};
					$(window).on("resize", resize);
					me.on("unbound", function(){
						$(window).off("resize", resize);
					});
				}else if(height !== "auto"){
					//not fixed and not auto
					el.css("height", height);
				}
			});
			
			return me.callParent(arguments);
		},
		/**
		 * overriding base method build
		 * @private
		 * @method build
		 */
		build: function(){
			var me = this,
				map = {},
				reorderedItems = [],
				item,
				position,
				length,
				centerGrid = {
					sName: "containers.box",
					defaults: me.defaults,
					css:'row-eq-height fb-ui-center-row',
					items:[]
				},
				entered = false;
			
			//if items is defined and has >= 1 item
			if(me.items){
				
				length = me.items.length;
				
				if(length){
					for(var i = 0; i<length; i++){
						item = me.items[i];	//get current item in iteration
						//get the correct position where this item should be: 0 - 4
						item.position = item.position.toLowerCase();
						position = me._itemArrayPosition(item.position);
						//store the position and item
						map[position] = item;
					}
					
					for(var ii = 0; ii<5; ii++){
						//get each item from the map in the correct order
						item = map[ii];
						//check if the item was defined
						if(item){
							//get the correct dimensions
							if(ii>0 && ii<4){
								//center pieces
								// 1|2|3
								centerGrid.items.push(item);
								if(centerGrid.items.length && !entered){
									entered = true;
									reorderedItems.push(centerGrid);
								}
							}else{
								//place the item in the correct order
								reorderedItems.push(item);
							}
							
						}
					}
					//replace the items with the same ones but in the correct order
					me.items = reorderedItems;
				}
				
			}
			return me.callParent(arguments);
		},
		
		/**
		 * get item border position 
		 * 
		 * ---- 0 ----
		 * 1 | 2 | 3 |
		 * ---- 4 ----
		 * 
		 * @method _itemArrayPosition
		 * @param position {String} top, right, bottom, left, center
		 * @return {Integer}
		 */
		_itemArrayPosition: function(position){
			var pos;
			
			if(position === "top"){
				pos = 0;
			}else if(position === "left"){
				pos = 1;
			}else if(position === "center"){
				pos = 2;
			}else if(position === "right"){
				pos = 3;
			}else if(position === "bottom"){
				pos = 4;
			}
			
			return pos;
		},
		
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.css["'fb-ui-borderlayout'"] = true;
			
			return obj;
		}
		
	});
});