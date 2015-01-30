/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.MultiplesBase
 * @namespace components.button
 * @class ToggleButton
 */
define(["text!./ToggleButton.html", "knockout", "jquery", "../common/MultiplesBase"], function(subTpl, ko, $){
	"use strict";
	
	if(!ko.bindingHandlers.toggleRenderer){
		/*
		 * optionsRenderer for togglebuttons
		 * create dynamic css along with static
		 */
		ko.bindingHandlers.toggleRenderer = {
		    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
				var me = Firebrick.ui.getCmp(valueAccessor()),
					currentStyle = "btn-"+me.btnStyle,
					$el = $(element),
					inputId = allBindings().withProperties.inputItemId;

				//ko data bound observable
				inputId = Firebrick.ui.utils.getValue(inputId);
				
				if($el.length){
					if(viewModel){
						if(viewModel.btnStyle){
							//replace element className with the new one defined in the binding
							$el.attr("class", function(i, v){
								return v.replace(currentStyle, "btn-" + Firebrick.ui.utils.getValue(viewModel.btnStyle));
							});
						}
						if(viewModel.css){
							$el.addClass(Firebrick.ui.utils.getValue(viewModel.css));
						}
					}
					//add the correct "for" attribute id and the input id
					$el.attr("for", inputId);
					$("> input", $el).attr("id", inputId);
				}
				
		    }
		};
	}
	
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
		 * @property defaultActive
		 * @type {Boolean|String}
		 * @default false
		 */
		defaultActive: false,
		/**
		 * @property dataToggle
		 * @type {Boolean|String}
		 * @default "buttons"
		 */
		dataToggle: "buttons",
		/**
		 * default, primary, success, danger, warning, info
		 * @property btnStyle
		 * @type {String|false}
		 * @default "primary"
		 */
		btnStyle: "default",
		/**
		 * lg,md,xs,sm
		 * @property btnSize
		 * @type {String|false}
		 * @default "md"
		 */
		btnSize: "md",
		/**
		 * options that are to be shown by the toggle button : [{text:"abc", active:true, config:{btnStyle:"success"}, "b", "c", "d"]
		 * @property options
		 * @type {String|Array of Objects}
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
		 * @property optionsRenderer
		 * @type {String}
		 * @default "optionsRenderer"
		 */
		optionsRenderer: "optionsRenderer",
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
					"'data-toggle'": me.parseBind(me.dataToggle)
				},
				foreach: Firebrick.ui.helper.optionString(me)
			};
		},
		/**
		 * @method toggleInputBindings
		 * @return {Object}
		 */
		toggleInputBindings: function(){
			var me = this;
			return {
				attr:{
					//id attribute is parsed by the toggleRenderer
					name: me.parseBind(me.name)
				},
				value:"$data.value || $data.text ? $data.value || $data.text : $data"
			};
		},
		
		/**
		 * @method toggleLabelBindings
		 * @return {Object}
		 */
		toggleLabelBindings: function(){
			var me = this,
				obj = {
					attr:{
						id: "$data.labelId || 'fb-ui-id-' + Firebrick.utils.uniqId()"
					},
					withProperties:{
						inputItemId:"$data.id || 'fb-ui-id-' + Firebrick.utils.uniqId()"
					},
					css:{
						active: "Firebrick.ui.getCmp('"+me.getId()+"')._valueChecker("+me.value+", $data)"
					},
					toggleRenderer: me.parseBind(me.getId()) 
				};

			if(me.btnClass){
				obj.css.btn = true;
			}
			
			if(me.btnStyle){
				obj.css[me.parseBind("btn-" + me.btnStyle)] = true;
			}
			
			if(me.btnSize){
				obj.css[me.parseBind("btn-" + me.btnSize)] = true;
			}
			
			return obj;
		},
		/**
		 * @method toggleLabelTextBindings
		 * @return {Object}
		 */
		toggleLabelTextBindings: function(){
			return {
				"text": "$data.text ? $data.text : $data"
			};
		}
	});
});