/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.MultiplesBase
 * @namespace components.button
 * @class ToggleButton
 */
define(["text!./ToggleButton.html", "../common/MultiplesBase"], function(subTpl){
	return Firebrick.define("Firebrick.ui.button.ToggleButton", {
		extend:"Firebrick.ui.common.MultiplesBase",
		/**
		 * component alias
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-togglebutton",
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl:subTpl,
		/**
		 * @property btnGroupClass
		 * @type {Boolean|String}
		 * @default true
		 */
		btnGroupClass:true,
		/**
		 * @property btnClass
		 * @type {Boolean|String}
		 * @default true
		 */
		btnClass: true,
		/**
		 * @property btnPrimaryClass
		 * @type {Boolean|String}
		 * @default true
		 */
		btnPrimaryClass: true,
		/**
		 * @property defaultActive
		 * @type {Boolean|String}
		 * @default false
		 */
		defaultActive: false,
		/**
		 * @property dataToggle
		 * @type {Boolean|String}
		 * @default "'buttons'"
		 */
		dataToggle: "'buttons'",
		/**
		 * options that are to be shown by the toggle button : [{text:"abc", active:true}, "b", "c", "d"]
		 * @property options
		 * @type {String}
		 * @default "''"
		 */
		options:"''",
		/**
		 * @property showLabel
		 * @type {Boolean}
		 * @default true
		 */
		showLabel: true,
		/**
		 * @method btnGroupBindings
		 * @return {Object}
		 */
		btnGroupBindings: function(){
			var me = this;
			return {
				css:{
					"'btn-group'": me.btnGroupClass
				},
				attr:{
					"'data-toggle'": me.dataToggle
				},
				foreach: me.options
			}
		},
		/**
		 * @method toggleInputBindings
		 * @return {Object}
		 */
		toggleInputBindings: function(){
			var me = this;
			return {
				attr:{
					id: "itemId"
				}
			}
		},
		/**
		 * @method toggleLabelBindings
		 * @return {Object}
		 */
		toggleLabelBindings: function(){
			var me = this;
			return {
				attr:{
					id: "itemId"
				},
				css:{
					btn: "$data.btnClass ? $data.btnClass : " + me.btnClass,
					"'btn-primary'": "$data.btnPrimaryClass ? $data.btnPrimaryClass : " + me.btnPrimaryClass,
					active: "$data.hasOwnProperty && $data.hasOwnProperty('active') ? $data : " + me.defaultActive 
				}
			}
		},
		/**
		 * @method toggleLabelTextBindings
		 * @return {Object}
		 */
		toggleLabelTextBindings: function(){
			return {
				"text": "$data.text ? $data.text : $data"
			}
		}
	})
});