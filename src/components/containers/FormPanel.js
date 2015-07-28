/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class FormPanel
 */
define(["./Panel", "./Form"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.FormPanel", {
		extend:"Firebrick.ui.containers.Panel",
		/**
		 * @property sName
		 * @type {String}
		 * @default "containers.formpanel"
		 */
		sName: "containers.formpanel",
		/**
		 * configuration to pass to the form section of the Panel
		 * @property formConfig
		 * @type {Object}
		 * @default null
		 */
		formConfig:null,
		/**
		 * @method build
		 * @private
		 */
		init: function(){
			var me = this,
				formItem = me.formConfig || {};
				
			formItem.sName = "containers.form";	

			if(me.items){
				formItem.items = me.items;
			}else{
				formItem.html = me.html;
			}
			
			me.items = [formItem];
			 
			return me.callParent(arguments);
		}
	});
});