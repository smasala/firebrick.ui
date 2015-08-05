/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class SelectBox
 */
define(["text!./SelectBox.html", "jquery", "knockout", "./Input"], function(subTpl, $, ko){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.SelectBox", {
		extend:'Firebrick.ui.fields.Input',
		/**
		 * @property sName
		 * @type {String}
		 */
		sName:"fields.selectbox",
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
		 * @type {KO String|Function|Array of Objects}
		 * @default false
		 */
		options:false,
		/**
		 * @property type
		 * @type {String}
		 * @default "select"
		 */
		type:"select",
		/**
		 * @property optionsValue
		 * @type {String}
		 * @default "value"
		 */
		optionsValue:"value",
		/**
		 * @property optionsText
		 * @type {String}
		 * @default "text"
		 */
		optionsText:"text",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings:function(){
			var me = this,
				obj = me.callParent(arguments);
			
			if(!me.inplaceEdit){
				obj.options = Firebrick.ui.helper.optionString(me);
				if(!me.multiSelect){
					obj.value = me.value;
				}else{
					obj.selectedOptions = me.value;
				}
				obj.optionsText = me.parseBind( me.optionsText );
				obj.optionsValue = me.parseBind( me.optionsValue );
				obj.attr.multiple = me.multiSelect;
			}
			
			return obj;
		},
		/**
		 * override parent method
		 * @method getInplaceEditText
		 * @private
		 * @param $data {KO Object}
		 * @return {String}
		 */
		_getInplaceEditText: function( $data ){
			var me = this,
				$el = me.getElement(),
				value = $el ? me.getValue() : me.value,
				options = me.options,
				optVal = me.optionsValue,
				optText = me.optionsText,
				text = "",
				it, unwrapped;
			
			if( value ){
				
				if($.isFunction(options)){
					options = options();
				}else if( typeof options === "string" ){
					options = ko.unwrap( $data.hasOwnProperty( options ) ? $data[ options ] : $data );
				}
				
				if( !$.isArray(options) ){
					options = [options];
				}
				
				for(var i = 0, l = options.length; i<l; i++){
					it = options[i];
					if( $.isPlainObject(it) ){
						unwrapped = ko.unwrap( it[ optVal ] );
						if(unwrapped === value.replace("'", "")){
							text = ko.unwrap( it[ optText ] );
							break;
						}
					}
				}
				
			}else{
				text = Firebrick.text( me.inplaceEditEmptyText );
			}
			
			return text;
		}
	});
});