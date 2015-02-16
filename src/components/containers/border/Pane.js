/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * 
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers.border
 * @class Pane
 */
define(["text!./SplitBar.html", "jquery", "../../common/mixins/Column", "./Draggable", "../Panel"], function(splitBarTpl, $){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.border.Pane", {
		extend:"Firebrick.ui.containers.Panel",
		mixins:"Firebrick.ui.common.mixins.Column",
		/**
		 * @property uiName
		 * @type {String}
		 * @default "fb-ui-border.pane"
		 */
		uiName:"fb-ui-borderpane",
		/**
		 * @property resizable
		 * @type {Boolean}
		 * @default false
		 */
		resizable: false,
		/**
		 * @property position
		 * @type {String} "top", "left", "center", "right", "bottom"
		 * @default ""
		 */
		position: "",
		/**
		 * @property collapseDirection
		 * @type {String}
		 * @default "left"
		 */
		collapseDirection: "left",
		/**
		 * @property splitbarIdPrefix
		 * @type {String}
		 * @default "fb-ui-bar"
		 */
		splitbarIdPrefix: "fb-ui-splitbar-",
		/**
		 * @private
		 * @property splitBarTpl
		 * @type {HTML}
		 * @default SplitBar.html
		 */
		splitBarTpl: splitBarTpl,
		/**
		 * @private
		 * @property _rotatedHeadingClass
		 * @type {String}
		 * @default "panel-rotated-heading"
		 */
		_rotatedHeadingClass: "panel-rotated-heading",
		/**
		 * @private
		 * @property _rotatedHeadingClass
		 * @type {String}
		 * @default "panel-rotated-heading"
		 */
		_rotatedTitleClass: "panel-rotated-title",
		/**
		 * @private
		 * @property _positionPrefixClass
		 * @type {String}
		 * @default "fb-ui-pane-position-"
		 */
		_positionPrefixClass: "fb-ui-pane-position-",
		/**
		 * @private
		 * @property _transitionClass
		 * @type {String}
		 * @default "fb-ui-transition"
		 */
		_transitionClass: "fb-ui-transition",
		/**
		 * @property height
		 * @type {Integer|String}
		 * @default "auto"
		 */
		height: "auto",
		/**
		 * only used for left and right panes
		 * @property width
		 * @type {Integer|String}
		 * @default "33%"
		 */
		width: "33%",
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function(){
			var me = this;
			
			me.on("htmlRendered", function(){
				return me._htmlRendered.apply(me, arguments);
			});
			
			me.on("rendered", function(){
				return me._rendered.apply(me, arguments);
			});
			
			return me.callParent(arguments);
		},
		
		/**
		 * listener for the event htmlRendered
		 * in this function the splitbar is added to its correct position
		 * only if the pane is resizable
		 * @private
		 * @method _htmlRendered
		 */
		_htmlRendered: function(){
			var me = this,
				el, splitbarHtml,
				position = me.position;
			
			if(me.resizable && position !== "center"){
				el = me.getElement();
				if(el){
					me.template("splitBarTpl");
					splitbarHtml = me.build("splitBarTpl");
					if(position !== "right" && position !== "bottom"){
						el.after(splitbarHtml);	
					}else{
						el.before(splitbarHtml);	
					}
					
				}
			}
			
			me._setDimensions();
			
		},
		
		/**
		 * accepts no parameters
		 * @private
		 * @method _setDimensions
		 */
		_setDimensions: function(){
			var me = this,
				el = me.getElement(),
				position = me.position,
				height = me.height,
				width = me.width;

			if(position === "top" || position === "bottom"){
				if(height !== "auto"){
					el.css("height", height);	
				}
			}
			
			if(position === "left" || position === "right"){
				el.css("width", width);
				el.css("min-width", width);
			}
			
		},
		
		/**
		 * listener for the event rendered
		 * @private
		 * @method _rendered
		 */
		_rendered: function(){
			var me = this;
			
			if (me.collapsible){
				me.setCollapsibleActions();
			}
			
			if(me.resizable){
				me.setResizableActions();
			}	
		},
		
		/**
		 * @method setCollapsibleActions
		 */
		setCollapsibleActions: function(){
			var me = this,
				el = me.getElement(),
				position = me.position;
			
			if(position === "left" || position === "right"){
				$("> .panel-collapse", el).on("hide.bs.collapse", function(){
					return me._onRLPaneCollapse.apply(me, arguments);
				});
				
				$("> .panel-collapse", el).on("show.bs.collapse", function(){
					return me._onRLPaneExpand.apply(me, arguments);
				});
			}else{
				//bottom & top panes
				$("> .panel-collapse", el).on("hide.bs.collapse", function(){
					return me._onTBPaneCollapse.apply(me, arguments);
				});
				$("> .panel-collapse", el).on("show.bs.collapse", function(){
					return me._onTBPaneExpand.apply(me, arguments);
				});
			}
		},
		
		/**
		 * @method setResizableActions
		 */
		setResizableActions: function(){
			var me = this,
				position = me.position,
				pane = me.getElement(),
				paneHeader = $("> .panel-heading", pane),
				vertical = position === "top" || position === "bottom" ? true : false,
				splitbar = position === "top" || position === "left" ? pane.next(".fb-ui-splitbar") : pane.prev(".fb-ui-splitbar");
				
			if(splitbar.length){
				if(vertical){
					//top bottom panes

					//if the class if NOT collapsed from the start, then enable resizing
					if(!pane.hasClass( me._collapsedClass )){
						me.enableDrags(splitbar, "vertical");
					}
					
					pane.on("fb-ui-panel-state-change", function(){
						//disable resize if the pane is collapsed
						if(pane.hasClass( me._collapsedClass )){
							me.disableDrags(splitbar);
						}else{
							me.enableDrags(splitbar, "vertical");
						}
					});
					
					//when the splitbar has been dragged, if the panel a new height
					splitbar.on("dragged", function(event, top/*, left*/){
						var val;
						if(position === "top"){
							val = pane.height() + top;
							if(val > 0){
								//subtract the header height to position the splitbar in the right place
								val -= paneHeader.height();
							}
							pane.css("height", val);
							pane.css("min-height", val);
						}else{
							val = pane.height() - top;
							if(val < 0){
								//add the header height to position the splitbar in the right place
								val += paneHeader.height();
							}
							pane.css("height", val);
							pane.css("min-height", val);
						}
						
					});
					
				}else{
					
					//if the pane is NOT collapsed from the start, enable resize functionality
					if(!pane.hasClass( me._collapsedClass )){
						me.enableDrags(splitbar, "horizontal");
					}
					
					pane.on("fb-ui-panel-state-change", function(){
						//disable resize if the panel is collapsed
						if(pane.hasClass( me._collapsedClass )){
							me.disableDrags(splitbar);
						}else{
							me.enableDrags(splitbar, "horizontal");
						}
					});
					
					//when the splitbar has been moved, calculate the new width of the pane
					splitbar.on("dragged", function(event, top, left){
						var width = pane.width();
						if(position === "right"){
							pane.width(width-left);
							pane.css("min-width", width-left);
						}else{
							pane.width(width+left);
							pane.css("min-width", width+left);
						}
						
					});
				}

			}
		},
		
		/**
		 * event callback (jQuery)
		 * top and bottom pane
		 * @private
		 * @method _onTBPaneCollapse
		 * @param me {Object} this class
		 * @param el {jQuery Object} panel|pane
		 */
		_onTBPaneCollapse: function(){
			var me = this,
				pane = me.getElement(),
				paneHeader = $("> .panel-heading", pane),
				paneHeaderHeight = paneHeader.outerHeight();

			if(!pane.prop("_fbResizeHeight")){
				//first time this is collapse - set the current height/min-height to the current values
				//if not set, css snaps a little and does not do the animation/transition properly
				pane.css("min-height", pane.css("min-height"));
				pane.css("height", pane.css("height"));
			}
			
			pane.addClass( me._transitionClass );

			pane.prop("_fbResizeHeight", pane.css("height"));	//save the height in the property, this is needed for transitions when the pane is expaneded again
			pane.css("min-height", paneHeaderHeight);
			pane.css("height", paneHeaderHeight);
			
			pane.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
				pane.removeClass( me._transitionClass );
			});
		},
		
		/**
		 * event callback (jQuery)
		 * top and bottom pane
		 * @private
		 * @method _onTBPaneExpand
		 * @param me {Object} this class
		 * @param el {jQuery Object} panel|pane
		 */
		_onTBPaneExpand: function(){
			var me = this,
				pane = me.getElement();
			
			//start transition
			pane.addClass( me._transitionClass );
			pane.css("min-height", pane.prop("_fbResizeHeight"));
			pane.css("height", pane.prop("_fbResizeHeight"));
			
			//listener when the transition has ended
			pane.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
				pane.removeClass( me._transitionClass );
			});
		},
		
		/**
		 * right and left pane
		 * event callback (jQuery)
		 * @private
		 * @method _onRLPaneExpand
		 * @param event {jQuery event Object}
		 */
		_onRLPaneExpand: function(){
			var me = this,
				pane = me.getElement(), 
				paneHeader = $("> .panel-heading", pane),
				paneTitle = $(".panel-title", paneHeader);
			
			//start transition
			pane.addClass( me._transitionClass );
			pane.trigger("pane-expanding");
			
			//remove the rotated effect on the panel title
			paneHeader.removeClass( me._rotatedHeadingClass );
			paneTitle.removeClass( me._rotatedTitleClass );
			
			pane.css("min-width", pane.prop("_fbResizeWidth"));
			
			//listener for when the transition has ended
			pane.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
				pane.removeClass( me._transitionClass );
			});
			
		},
		
		/**
		 * right and left pane
		 * event callback (jQuery)
		 * @private
		 * @method _onRLPaneCollapse
		 * @param event {jQuery event Object}
		 */
		_onRLPaneCollapse: function(){
			var me = this,
				pane = me.getElement(), 
				paneHeader = $("> .panel-heading", pane),
				paneTitle = $(".panel-title", paneHeader),
				paneHeaderHeight = paneHeader.outerHeight();
			
			
			//start transition
			pane.addClass( me._transitionClass );
			pane.trigger("pane-collapsing");
			
			pane.prop("_fbResizeWidth", pane.css("width"));	//save the width in the property, this is needed for transitions when the pane is expaneded again
			
			pane.css("min-width", paneHeaderHeight);
			pane.css("width", paneHeaderHeight);
			
			//listener for when the transition has ended
			pane.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
				//rotate header & title
				paneHeader.addClass( me._rotatedHeadingClass );
				paneTitle.addClass( me._rotatedTitleClass );
				
				pane.removeClass( me._transitionClass );
			});
			
		},
		
		/**
		 * enable drags function on element
		 * @method enableDrags
		 */
		enableDrags: function(pane, direction){
			pane.prop("dragDisabled", false);
			pane.drags(direction);
		},
		/**
		 * disable drags function on element
		 * @method disableDrags
		 */
		disableDrags: function(pane){
			pane.prop("dragDisabled", true);
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.css["'fb-ui-border-pane'"] = true;
			
			//type of pane - top, right, left etc..
			obj.css[me.parseBind(me._positionPrefixClass + me.position)] = true;
			
			if(me.collapsible){
				obj.css["'fb-ui-pane-collapsible'"] = true;
			}
			
			return obj;
		},
		
		/**
		 * @method barBindings
		 * @return {Object}
		 */
		splitbarBindings: function(){
			var me = this,
				obj = {css:{
					"'fb-ui-splitbar'": true
				}, attr:{}};

			obj.css[me.parseBind("fb-ui-splitbar-" + me.position )] = true;
			
			if(me.position === "top" || me.position === "bottom"){
//				obj.css.col = true;
//				obj.css[me.parseBind("col-" + me.deviceSize + "-12")] = true;
				obj.css["'fb-ui-splitbar-horizontal'"] = true;
			}else{
				obj.css["'fb-ui-splitbar-vertical'"] = true;
			}
			
			return obj;
		},
		
		/**
		 * @method getBarId
		 * @return {String}
		 */
		getSplitbarId: function(){
			var me = this;
			return me.splitbarIdPrefix + me.getId();
		}
	});
});