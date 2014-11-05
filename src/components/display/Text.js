/**
 * Extends: {{#crossLink "Firebrick.ui.components.common.Base"}}{{/crossLink}}
 * @module Firebrick.ui.components
 * @extends Firebrick.ui.components.common.Base
 * @namespace Firebrick.ui.components.display
 * @class Text
 */
define(["text!./Text.html", "../common/Base"], function(tpl){
	return Firebrick.create("Firebrick.ui.display.Text", {
		extend: "Firebrick.ui.common.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-text",
		/**
		 * @property tpl
		 * @type {String}
		 */
		tpl:tpl,
		/**
		 * whether text is raw html or not
		 * @property isHtml
		 * @type {Boolean}
		 * @default false
		 */
		isHtml:false,
		/**
		 * @property text
		 * @type {String}
		 * @default ""
		 */
		text:"",
		/**
		 * @property leadCSS
		 * @type {Boolean}
		 * @default false
		 */
		leadCSS:false,
		/**
		 * @property blockQuote
		 * @type {Boolean}
		 * @default false
		 */
		blockQuote:false,
		/**
		 * @property blockQuoteReverseCSS
		 * @type {Boolean}
		 * @default false
		 */
		blockQuoteReverseCSS: false,
		/**
		 * false not to show, string for footer text
		 * @property blockQuoteFooter
		 * @type {Boolean|String}
		 * @default false
		 */
		blockQuoteFooter:false,
		/**
		 * @property isBlockQuoteFooterHTML
		 * @type {Boolean}
		 * @default false
		 */
		isBlockQuoteFooterHTML: false,
		/**
		 * false || string :: 'left', 'center', 'right', 'justify', 'no-wrap' (defaults to: left)
		 * @property textAlignment
		 * @type {Boolean|String}
		 * @default "justify"
		 */
		textAlignment:"justify",
		/**
		 * Bindings
		 * @method bindings
		 * @returns {Object}
		 */
		bindings:function(){
			var me = this,
				obj = {
					css:{
						lead: me.leadCSS
					}
				};
			
			if(me.textAlignment){
				obj.css["'text-"+me.textAlignment+"'"] = true;	
			}
			
			if(me.html){
				obj.html = me.text; 
			}else{
				obj.text = me.text;
			}
			
			return obj;
		},
		/**
		 * @method blockQuoteBindings
		 * @returns {Object}
		 */
		blockQuoteBindings: function(){
			return {
				css:{
					"'blockquote-reverse'": this.blockQuoteReverseCSS
				}
			};
		},
		/**
		 * @method blockQuoteFooterBindings
		 * @returns {Object}
		 */
		blockQuoteFooterBindings: function(){
			var me = this,
				obj = {};
			if(me.html){
				obj.html = me.blockQuoteFooter; 
			}else{
				obj.text = me.blockQuoteFooter;
			}
			return obj;
		}
	});
});