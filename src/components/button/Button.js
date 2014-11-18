/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module ui.components
 * @extends ui.components.common.Base
 * @namespace ui.components.button
 * @class Button
 */
define(["text!./Button.html", "../common/Base"], function(tpl){
	return Firebrick.create("Firebrick.ui.button.Button", {
		extend:"Firebrick.ui.common.Base",
		uiName: "fb-ui-button",
		tpl:tpl,
		text:"",
		/**
		 * @property btnSize
		 * @type {Boolean|String} false |  ("sm", "lg", "xs")
		 * @default false
		 */
		btnSize:false,
		/**
		 * @property btnStyle
		 * @type {Boolean|String} false | (default, primary, success, info, warning, danger, link)
		 * @default "default"
		 */
		btnStyle:"default",
		/**
		 * default bindings called by data-bind={{data-bind}}
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = {
					type: "button",
					text: "fb.text('" + me.text + "')",
					css:{
						"'btn'": true
					}
				}
			if(me.btnStyle){
				obj.css["'btn-"+me.btnStyle+"'"] = true;
			}
			if(me.btnSize){
				obj.css["'btn-" + me.btnSize + "'"] = true;
			}
			return obj;
		}
	})
});