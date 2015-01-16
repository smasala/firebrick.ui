/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * http://www.eyecon.ro/bootstrap-datepicker/
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class Datepicker
 */
define(["./Input"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.DatePicker", {
		extend:"Firebrick.ui.fields.Input",
		/**
		 * @property dateFormat
		 * @type {String}
		 * @default "yyyy/mm/dd"
		 */
		dateFormat: "dd/mm/yyyy",
		/**
		 * Sunday = 0, Saturday = 6 
		 * @property weekStart
		 * @type {Integer}
		 * @default 1
		 */
		weekStart: 1,
		/**
		 * @property datePickerOptions
		 * @type {Object|null}
		 * @default null
		 */
		datePickerOptions: null,
		/**
		 * glyphicon to so in the inputAddon box
		 * @property iconClass
		 * @type {String|false}
		 * @default "glyphicon-calendar"
		 */
		iconClass: "glyphicon-calendar",
		/**
		 * @method init
		 * @return parent
		 */
		init: function(){
			var me = this;
			
			me.on("rendered", function(){
				var el = me.getElement(),
					opts = me.datePickerOptions;
				
				if(!$.isPlainObject(opts)){
					opts = {};
				}
				
				opts.weekStart = me.weekStart;
				opts.format = me.dateFormat;
				
				if(el.length){
					el.datepicker(opts);
				}
			});
			
			return me.callParent(arguments);
		},
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-datepicker",
		inputAddon: true,
		/**
		 * @property value
		 * @type {String}
		 * @default current day
		 */
		value:(function(){
			var dt = new Date();
			return "'" +  ("0" + dt.getDate()).slice(-2)  + "/" + dt.getMonth() + 1 + "/" +  dt.getFullYear() + "'";
		})()
	});
});