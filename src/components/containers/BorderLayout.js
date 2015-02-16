/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class BorderLayout
 */
define(["./Base", "./border/Pane", "./GridRow"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.BorderLayout", {
		extend:"Firebrick.ui.containers.GridRow",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-borderlayout",
		
		/**
		 * @property defaults
		 * @type {Object}
		 * @default {
		 * 		uiName: fb.ui.cmp.borderpane
		 * }
		 */
		defaults: {
			uiName: fb.ui.cmp.borderpane
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
			top: 12,
			right: 3,
			bottom: 12,
			left: 3,
			center: 12 //force 100%
		},
		/**
		 * @property height
		 * @type {Integer|String} px value | auto
		 * @default "auto"
		 */
		height: "auto",
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function(){
			var me = this;
			
			me.on("rendered", function(){
				var el = me.getElement(),
					height = me.height;
				if(height !== "auto"){
					el.css("height", height);
				}else{
					//set a fixed height for the borderLayout so that the height
					//of the vertical panes grow in the correct direction
					el.css("height", el.height());
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
					uiName: fb.ui.cmp.gridrow,
					defaults: me.defaults,
					css:'row-eq-height',
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
							item = me._setColDimensions(item, map);
							if(ii>0 && ii<4){
								//center pieces
								// 1|2|3
								centerGrid.items.push(item);
							}else{
								if(centerGrid.items.length && !entered){
									entered = true;
									reorderedItems.push(centerGrid);
								}
								//place the item in the correct order
								reorderedItems.push({
									uiName: fb.ui.cmp.gridrow,
									defaults: me.defaults,
									items:[item]
								});
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
		 * sets column width offset and other initial properties
		 * @method _setColDimensions
		 * @param item {Object}
		 * @param map {Object of items}
		 * @return item {Object}
		 */
		_setColDimensions: function(item, map){
			var me = this,
				position = item.position;
			if(position){

				if(position === "left"){
					item.columnWidth = item.columnWidth || me.defaultSizes.left;
				}else if(position === "center"){
					item = me._calcCenterPos(item, map);
				}else if(position === "right"){
					item = me._calcRightPos(item, map);
				}else{
					item.columnWidth = item.columnWidth || 12;
				}
			}
			
			return item;
		},
		
		/**
		 * sets column width offset and other initial properties for the right column (number 3)
		 * @method _calcRightPos
		 * @param item {Object}
		 * @param map {Object of items}
		 * @return item {Object}
		 */
		_calcRightPos: function(item, map){
			var me = this,
				offset = 0;
			
			// ---------------- 0 ----------------
			// 1 (left) | 2 (center) | 3 (right) |
			// ---------------- 4 ----------------
			
			//offset not set - so calculate it
			if(!item.columnOffset){
				//twelve is max, (bootstrap grid
				//offset is needed if the left/center columns are missing
				//offset pushes the column to the right side
				offset = me._maxGridCols - (item.columnWidth || me.defaultSizes.right);
				
				//left column exist
				if(map[1]){
					offset -= map[1].columnWidth || me.defaultSizes.left;
					offset -= map[1].columnOffset || 0;
				}
				
				//center column exist
				if(map[2]){
					offset -= map[2].columnWidth || me.defaultSizes.center;
					offset -= map[2].columnOffset || 0;
				}
				
				item.columnOffset = offset >= 0 ? offset : 0;
			}

			//width not set - set default size
			if(!item.columnWidth){
				item.columnWidth = me.defaultSizes.right;
			}
				
			return item;
		},
		
		/**
		 * force center pane to be 100% - regardless of properties
		 * @method _calcCenterPos
		 * @param item {Object}
		 * @param map {Object of items}
		 * @return item {Object}
		 */
		_calcCenterPos: function(item/*, map*/){
			var me = this;
			
			item.columnWidth = me.defaultSizes.center;
			item.columnOffset = null;	//delete columnOffset
			
			return item;
			
//			var me = this,
//				width = 0;
//			
//			// ---------------- 0 ----------------
//			// 1 (left) | 2 (center) | 3 (right) |
//			// ---------------- 4 ----------------
//			
//			if(!item.columnWidth){
//				//left column exist
//				if(map[1]){
//					width += map[1].columnWidth || me.defaultSizes.left;
//				}
//				//right column exist
//				if(map[3]){
//					width += map[3].columnWidth || me.defaultSizes.right;
//				}
//				
//				width = me._maxGridCols - width;
//				item.columnWidth = width;
//			}
//			
//			return item;
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