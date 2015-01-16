/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.MultiplesBase
 * @namespace components.fields
 * @class Radio
 */
define(["text!./Radio.html", "../common/MultiplesBase", "./plugins/Radio"], function(subTpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.Radio", {
		extend:"Firebrick.ui.common.MultiplesBase",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-radio",
		/**
		 * @property type
		 * @type {String}
		 * @default "'radio'"
		 */
		type:"radio",
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'radiolist'"
		 */
		dataType:"radiolist",
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl:subTpl,
		/**
		 * @property showOptionLabel
		 * @type {Boolean}
		 * @default true
		 */
		showOptionLabel: true,
		/**
		 * radio options
		 * @property options
		 * @type {Boolean|String}
		 * @default false
		 */
		options:false,
		/**
		 * @property optionsPropValue
		 * @type {String}
		 * @default "value"
		 */
		optionsPropValue: "value",
		/**
		 * @property optionsPropText
		 * @type {String}
		 * @default "text"
		 */
		optionsPropText: "text",
		/**
		 * @method optionLabelBindings
		 * @return {Object}
		 */
		optionLabelBindings:function(){
			var me = this;
			if(!me.inplaceEdit){
				return {
					text:"$data.text ? fb.text($data.text) : fb.text($data)"
				};
			}
			return {};
		},
		/**
		 * @method optionLabelContainerBindings
		 * @return {Object}
		 */
		optionLabelContainerBindings:function(){
			var me = this;
			return {
				attr: {
					"for": me.inplaceEdit ?  me.parseBind(me.getId()) : "itemId"
				}
			};
		},
		/**
		 * @method inputContainerBindings
		 * @return {Object}
		 */
		inputContainerBindings:function(){
			var me = this,
				obj = me.callParent(arguments);
			if(me.options && !me.inplaceEdit){
				obj.foreach = $.isArray(me.options) ? "Firebrick.ui.getCmp('" + me.getId() + "').options" : me.options;
			}
			return obj;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings:function(){
			var me = this,
				obj = me.callParent(arguments);
			
			if(me.inplaceEdit){
				obj.editable = me.selectedOptions || false;
				obj.editableOptions = {
						optionsValue:me.parseBind(me.optionsPropValue),
						optionsText:me.parseBind(me.optionsPropText),
						options:me.options,
						type:"'checklist'"
				};
			}
			
			obj.css["'form-control'"] = false;
			if(!me.inplaceEdit){
				obj.value = "$data.value ? $data.value : $data";
				obj.attr.id = "itemId";
			}else{
				obj.attr.id =  me.parseBind(me.getId());
			}
			obj.attr.name = me.parseBind( me.cleanString(me.type)+"-group-"+Firebrick.utils.uniqId() );
			obj.checked = me.value + " !== null ? " + me.value + " === ($data.value || $data) : $data.checked ? $data.checked : false";
			return obj;
		}
	});
});