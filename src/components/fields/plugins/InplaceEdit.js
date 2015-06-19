/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module plugins
 * @namespace plugins
 * @class InplaceEdit
 */
define(["jquery", "knockout", "Firebrick.ui/containers/GridRow", "Firebrick.ui/containers/Box", "Firebrick.ui/button/Icon"], function($, ko){
	"use strict";
	
	return Firebrick.define("Firebrick.ui.fields.plugins.InplaceEdit", {
		/**
		 * @property fieldItem
		 * @type {Firebrick UI Object}
		 */
		fieldItem: null,
		/**
		 * optional
		 * @property items
		 * @type {Array of Objects}
		 */
		items: null,
		/**
		 * @property showInplaceTitle
		 * @type {Boolean}
		 */
		showInplaceTitle: true,
		/**
		 * @property inplaceTitle
		 * @type {String}
		 * @default null
		 */
		title: null,
		/**
		 * css width of the popover
		 * @property width
		 * @type {String}
		 * @default "250px"
		 */
		width: "250px",
		/**
		 * popover placement
		 * @property placement
		 * @type {String|Function}
		 * @default "auto"
		 */
		placement: "auto",
		/**
		 * set to true to place at the bottom of the popover rather than the top
		 * @property actionButtonsFooter
		 * @type {Boolean}
		 * @default false
		 */
		actionButtonsFooter: false,
		/**
		 * @method _getPopoverEl
		 * @private
		 * @return {jQuery Object}
		 */
		_getPopoverEl: function(){
			var me = this;
			return $("+ .popover", me.fieldItem.getElement());
		},
		/**
		 * @method init
		 */
		init: function(){
			var me = this,
				$el = me.fieldItem.getElement();
			if($el){
				$el.on("click", function(){
					return me.onEditClick.apply(me, arguments);
				});
				me.fieldItem.on("changed", function(){
					$el.addClass("fb-ui-inplaceedit-changed");
				});
			}else{
				console.info("no el", me);
			}
		},
		/**
		 * @method buildItems
		 * @return {Array of Objects}
		 */
		buildItems: function(){
			var me = this,
				items = [],
				type = me.fieldItem.type,
				field,
				valStr = "Firebrick.getById('" + me.fieldItem.getId() + "').getValue()",
				tmp;
			if(me.items){
				items = me.items;
			}else{
				field = {
					css: "fb-ui-inplaceedit-field",
	    			inputSize: "sm",
	    			label: false,
	    			inputWidth:12,
				};
				if(type === "text"){
					tmp = {
		    			sName:	"fields.input",
						value: valStr
		    		};
				}else if(type === "select"){
					tmp = {
						sName: "fields.selectbox",
						options: me.fieldItem.options,
						selectedOptions: valStr,
						value: valStr
					}
				}
				items.push( Firebrick.utils.overwrite(field, tmp) );
			}
			return items;
		},
		/**
		 * @method showPopover
		 */
		showPopover: function(){
			var me = this;
			me._initBSPopover();
			me._showBSPopover();
			me._initPopoverContent();
		},
		/**
		 * @method _initPopoverContent
		 */
		_initPopoverContent: function(){
			var me = this;
			Firebrick.create("Firebrick.ui.containers.GridRow", {
	    		target: $(".popover-content", me._getPopoverEl()),
	    		store: ko.dataFor( me.fieldItem.getElement()[0] ),
	    		items:[{
	    			columnWidth: me.actionButtonsFooter ? 12 : 7,
	    			items: me.buildItems()
	    		},{
	    			columnWidth: me.actionButtonsFooter ? 12 : 5,
	    			items: me.actionButtons()
	    		}],
	    		init: function(){
	    			var me1 = this;
	    			me1.on("rendered", function(){
	    				me.reposition();
	    			});
	    			return me1.callParent(arguments);
	    		}
			});
		},
		/**
		 * @method reposition
		 */
		reposition: function(){
			var me = this;
			
			me._getPopoverEl().css({
				left: 0,
				top: me.fieldItem.getElement().height()
			});
		},
		/**
		 * initialises the bootstrap popover - doesn't show it though
		 * @method _initBSPopover
		 */
		_initBSPopover: function(){
			var me = this,
				title = fb.text( me.showInplaceTitle ? ( me.title || me.fieldItem.label || "" ) : "" );
			
			me.fieldItem.getElement().popover({ 
			    html : true,
			    title: title || " ",
			    placement: me.placement,
			 	trigger:"manual",
			});
		},
		
		/**
		 * shows the actually bootstrap popover
		 * @method _showBSPopover
		 */
		_showBSPopover: function(){
			var me = this,
				$popover;
			
			me.fieldItem.getElement().popover("toggle");
			
			$popover = me._getPopoverEl();
			if(me.width){
				$popover.css("width", me.width);
				$popover.css("max-width", me.width);
			}
			
			me._initDismissEvent();
		},
		/**
		 * dismisses the popover when clicked out side it
		 * @method _initDismissEvent
		 */
		_initDismissEvent: function(){
			var me = this;
			//delay because otherwise it catches the <a> click on opening the popover
			Firebrick.delay(function(){
				var func = function(event){
					var $el = $(event.target);
					if(!$el.closest(".popover").length){
						me.fieldItem.getElement().popover("destroy");
						$("html").off("click", func);	
					}
				};
				$("html").on("click", func);
				me.fieldItem.getElement().on("hide.bs.popover hidden.bs.popover", function(){
					$("html").off("click", func);
				});
			}, 1);
		},
		/**
		 * @method okAction
		 */
		okAction: function(){
			var me = this;
			me.setValue( me.getValue() );
			me.fieldItem.getElement().popover("toggle");
		},

		/**
		 * @method cancelAction
		 */
		cancelAction: function(){
			var me = this;
			me.fieldItem.getElement().popover("destroy");
		},
		
		/**
		 * @method actionButtons
		 * @return {Array of Objects}
		 */
		actionButtons: function(){
			var me = this;
			return [{
				sName: "containers.box",
				css: me.actionButtonsFooter ? "pull-right" : "",
				items:[{
					sName: "button.button",
					glyIcon:"ok",
					btnStyle: "primary",
					btnSize: "sm",
					handler: function(){
						return me.okAction.apply(me, arguments);
					}
				},{
					sName: "button.button",
					glyIcon:"remove",
					btnStyle: "default",
					btnSize: "sm",
					handler: function(){
						return me.cancelAction.apply(me, arguments);
					}
				}]
			}];
		},
		
		onEditClick: function(){
			var me = this;
			me.showPopover();
		},
		
		getValue: function(){
			var me = this,
				$popover = me._getPopoverEl(),
				$el = $(".fb-ui-inplaceedit-field", $popover);
			
			return $el.val();
		},
		
		setValue: function( value ){
			var me = this;
			me.fieldItem.setValue( value );
		}
	});
	
});