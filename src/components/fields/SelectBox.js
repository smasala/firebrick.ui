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
		 * @property data
		 * @type {String|Function}
		 * @default false
		 */
		data:false,
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'select'2
		 */
		dataType:"'select'",
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
				obj = me.callParent(),
				data = $.isFunction(me.data) ? me.data() : me.data;
			obj.attr.multiple = me.multiSelect;
			
			if(!me.inplaceEdit){
				obj.options = data;
				obj.selectedOptions = me.selectedOptions;
			}else{
				obj.editable = me.selectedOptions;
				obj.editableOptions = {
						optionsValue:me.optionsValue,
						optionsText:me.optionsText,
						options:data,
						type:me.dataType
				}
			}
			return obj;
		}
	})
});