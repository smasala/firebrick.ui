/**
 * Extends: {{#crossLink "Firebrick.ui.components.common.Base"}}{{/crossLink}}
 * @module Firebrick.ui.components
 * @extends Firebrick.ui.components.common.Base
 * @namespace Firebrick.ui.components.display
 * @class Header
 */
define(["text!./Header.html", "../common/Base"], function(tpl){
	return Firebrick.create("Firebrick.ui.display.Header", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-header",
		/**
		 * @property tpl
		 * @type {String}
		 */
		tpl:tpl,
		/**
		 * use to determine whether h1, h2, h3 etc - default = 1
		 * @property headerType
		 * @type {Int}
		 * @default 1
		 */
		headerType:1,
		/**
		 * @property headerText
		 * @type {String}
		 * @default ""
		 */
		headerText:"",
		/**
		 * @property secondaryText
		 * @type {String}
		 * @default ""
		 */
		secondaryText:"",
		/**
		 * @property labelText
		 * @type {String}
		 * @default ""
		 */
		labelText:"",
		/**
		 * string = "default", "primary", "success" "info", "warning", "danger"  
		 * @property labelCSS
		 * @type {Boolean, String}
		 * @default "default"
		 */
		labelCSS: "default",
		/**
		 * @method bindings
		 * @returns Object
		 */
		bindings: function(){
			return {
				text: this.headerText
			};
		},
		/**
		 * @method secondaryTextBindings
		 * @returns Object
		 */
		secondaryTextBindings: function(){
			var me = this;
			if(me.secondaryText){
				return {
					text: me.secondaryText
				};
			}else{
				return {
					visible:false
				};
			}
		},
		/**
		 * @method labelBindings
		 * @returns Object
		 */
		labelBindings: function(){
			var me = this, 
				obj;
			if(me.labelText){
				obj = {
						text: me.labelText,
						css:{
							label: true
						}
					};
				if(me.labelCSS){
					obj.css["'label-"+me.labelCSS+"'"] = true;
				}
				return obj;
			}else{
				return {
					visible:false
				};
			}
		}
		
	});
});