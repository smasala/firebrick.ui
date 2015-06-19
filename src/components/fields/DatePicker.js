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
define(["./Input", "bootstrap-datepicker"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.DatePicker", {
		extend:"Firebrick.ui.fields.Input",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fields.datepicker"
		 */
		sName: "fields.datepicker",
		/**
		 * @property inputAddon
		 * @default true
		 */
		inputAddon: true,
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
		 * @method datePickerOptions
		 * @return {Object}
		 */
		datePickerOptions: function(){
			var me = this;
			return {
				autoclose: true,
				weekStart: me.weekStart,
				format: me.dateFormat
			};
		},
		/**
		 * glyphicon to so in the inputAddon box
		 * @property iconClass
		 * @type {String|false}
		 * @default "glyphicon-calendar"
		 */
		iconClass: "glyphicon-calendar",
		/**
		 * whether the calendar inputaddon icon is clickable or not
		 * @property clickableIcon
		 * @type {Boolean}
		 * @default true
		 */
		clickableIcon: true,
		/**
		 * @method init
		 * @return parent
		 */
		init: function(){
			var me = this;
			
			me.on("rendered", function(){
				var el = me.getElement(),
					inputAddon,
					icon;
				
				if(el.length){
					el.datepicker(me.datePickerOptions());
				}
				
				if(me.inputAddon && me.clickableIcon){
					inputAddon = el.siblings("." + me.inputAddonClass);
					if(inputAddon.length){
						icon = inputAddon.find("." + me.iconClass);
						if(icon.length){
							icon.css("cursor", "pointer");
							icon.on("click", function(){
								var prop = "fb-date-open";
								if(el.prop(prop) === true){
									el.datepicker("hide");
									el.prop(prop, false);
								} else {
									el.prop(prop, true);
									//when the icon is clicked focus is given to the input field to open the datepicker
									el.focus();
								}
							});
						}
					}
				}
			});
			
			return me.callParent(arguments);
		},
		
		/**
		 * Immediately invoked function
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