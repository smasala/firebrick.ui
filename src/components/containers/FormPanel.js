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
		 * @default "fb-ui-formpanel"
		 */
		sName:"containers.formpanel",
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
		build: function(){
			var me = this,
			formItem = me.formConfig || {};
				
			formItem.sName = "containers.form";	
			
			formItem.items = me.items;
			me.items = formItem;
			
			return me.callParent(arguments);
		}
	});
});