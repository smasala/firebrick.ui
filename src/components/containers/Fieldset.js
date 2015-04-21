/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Fieldset
 */
define(["text!./Fieldset.html", "jquery"], function(tpl, $){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.Fieldset", {
		extend:"Firebrick.ui.containers.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.fieldset",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl:tpl,
		/**
		 * @property title
		 * @type {String}
		 * @default ""
		 */
		title:"",
		/**
		 * @property collapsible
		 * @type {Boolean}
		 * @default false
		 */
		collapsible: false,
		/**
		 * @property collapsed
		 * @type {Boolean}
		 * @default false
		 */
		collapsed: false,
		/**
		 * @property fieldsetBodyClass
		 * @type {String}
		 * @default "fb-ui-fieldset-body"
		 */
		fieldsetBodyClass: "fb-ui-fieldset-body",
		/**
		 * @property showLegend
		 * @type {Boolean}
		 * @default true
		 */
		showLegend: true,
		/**
		 * on the entire fieldset. See: collapseIconClass/expandIconClass for legend icon
		 * @property collapsedClass
		 * @type {String}
		 * @default "collapsed"
		 */
		collapsedClass: "collapsed",
		/**
		 * css is animated or not
		 * @property animated
		 * @type {Boolean}
		 * @default true
		 */
		animated: true,
		/**
		 * css class for icon to expand when collapsed
		 * @property expandIconClass
		 * @type {String|false}
		 * @default "glyphicon-chevron-up"
		 */
		expandIconClass: "glyphicon-chevron-right",
		/**
		 * css class for icon to collapse when expanded
		 * @property collapseIconClass
		 * @type {String|false}
		 * @default "glyphicon-chevron-down"
		 */
		collapseIconClass: "glyphicon-chevron-down",
		/**
		 * @method init
		 * @return {Object}
		 */
		init: function(){
			var me = this,
				obj = me.callParent();
			
			me.on("rendered", function(){
				var el = me.getElement(),
					linkEl = $("> a[data-collapse='" + me.getId() + "']", el);
				
				linkEl.on("click", function(){
					me.collapseClick.apply(me, arguments);
				});
				
			});
			
			return obj;
		},
		/**
		 * called when the legend is clicked on 
		 * @method collapseClick
		 * @param jQuery "click" event arguments {Any}
		 */
		collapseClick: function(event){
			var me = this,
				el, body, title;
			
			event.preventDefault();
			
			//init after preventDefault
			el = me.getElement();
			body = $("> div." + me.fieldsetBodyClass, el);
			title = $("> a > legend > span.fb-ui-collapsed-icon", el);

			//TODO: animation
			if(body.is(":visible")){
				title.removeClass( me.collapseIconClass );
				title.addClass( me.expandIconClass );
				
				el.addClass( me.collapsedClass );
				body.hide();
			}else{
				title.removeClass( me.expandIconClass );
				title.addClass( me.collapseIconClass );
				
				el.removeClass( me.collapsedClass );
				body.show();
			}
			
		},
		/**
		 * @method legendBindings
		 * @return {Object}
		 */
		legendBindings: function(){
			return {};
		},
		/**
		 * @method legendTextBindings
		 * @return {Object}
		 */
		legendTextBindings: function(){
			var me = this,
				obj = {
					css:{},
					attr:{},
					text: me.textBind(me.title)
				};
			return obj;
		},
		/**
		 * @method collapsibleBindings
		 * @return {Object}
		 */
		collapsibleBindings: function(){
			var me = this,
				obj = {
					css:{
						"'fb-ui-collapsed-icon'": true
					}
				};
			
			obj.css.glyphicon = true;
			if(me.collapsed){
				obj.css[ me.parseBind(me.expandIconClass) ] = true;
			}else{
				obj.css[ me.parseBind(me.collapseIconClass) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method collapsibleLinkBindings
		 * @return {Object}
		 */
		collapsibleLinkBindings: function(){
			var me = this,
				obj = {
					attr:{
						"'data-collapse'": me.parseBind( me.getId() )
					}
				};
			return obj;
		},
		/**
		 * @method contentBindings
		 * @return {Object}
		 */
		contentBindings: function(){
			var me = this,
				obj = {
					css:{
						collapsed: me.collapsed
					}
				};
			
			obj.css[me.parseBind(me.fieldsetBodyClass)] = true;
			
			return obj;
		}
	});
});