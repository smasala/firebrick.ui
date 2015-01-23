/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class SelectBox
 */
define(["text!./SelectBox.html", "jquery", "./Input"], function(subTpl, $){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.SelectBox", {
		extend:'Firebrick.ui.fields.Input',
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-selectbox",
		/**
		 * @property multiSelect
		 * @type {Boolean}
		 * @default false
		 */
		multiSelect:false,
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl:subTpl,
		/**
		 * @property options
		 * @type {String|Function|Array of Objects}
		 * @default false
		 */
		options:false,
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'select'2
		 */
		dataType:"select",
		/**
		 * @property selectedOptions
		 * @type {String}
		 * @default false
		 */
		selectedOptions:false,
		/**
		 * @property optionsValue
		 * @type {String}
		 * @default "'value'"
		 */
		optionsValue:"'value'",
		/**
		 * @property optionsText
		 * @type {String}
		 * @default "'text'"
		 */
		optionsText:"'text'",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings:function(){
			var me = this,
				obj = me.callParent(arguments),
				data = me.options;
			
			if($.isFunction(data)){
				data = data();
			}else if($.isArray(data)){
				data = "Firebrick.ui.getCmp('" + me.getId() + "').options";
			}
			
			obj.attr.multiple = me.multiSelect;
			
			if(!me.inplaceEdit){
				obj.options = data;
				obj.selectedOptions = me.selectedOptions;
				obj.optionsText = me.optionsText;
				obj.optionsValue = me.optionsValue;
			}else{
				obj.editable = me.selectedOptions;
				obj.editableOptions = {
						optionsValue:me.optionsValue,
						optionsText:me.optionsText,
						options:data,
						type: me.parseBind( me.dataType )
				};
			}
			return obj;
		}
	});
});