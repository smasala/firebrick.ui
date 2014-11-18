/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module ui.components
 * @extends ui.components.containers.Base
 * @namespace ui.components.containers
 * @class Form
 */
define(["text!./Form.html", "./Base"], function(tpl){
	return Firebrick.define("Firebrick.ui.containers.Form", {
		extend:"Firebrick.ui.containers.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-form",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl:tpl,
		/**
		 * @property formRole
		 * @type {String}
		 * @default "'form'"
		 */
		formRole:"'form'",
		/**
		 * @property horizontal
		 * @type {Boolean|String}
		 * @default true
		 */
		horizontal:true,
		/**
		 * @property inline
		 * @type {Boolean|String}
		 * @default false
		 */
		inline:false,
		/**
		 * @method formBindings
		 * @return {Object}
		 */
		formBindings:function(){
			var me = this;
			return {
				attr:{
					id: "'" + me.getId() + "'",
					role: me.formRole
				},
				css:{
					"'form-horizontal'": this.horizontal,
					"'form-inline'": this.inline
				}
			};
		}
	})
});