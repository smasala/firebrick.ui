/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.fields
 * @class Base
 */
define(["../common/Base"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.Base", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName:"fields.base",
		/**
		 * override method to fire events on actual element - append fb.ui. to event name
		 * @method fireEvent
		 */
		fireEvent: function(){
			var me = this,
				$el = me.getElement(),
				args = Firebrick.utils.argsToArray( arguments ),
				eventName = args[0];
			
			if($el){
				//remove eventName from args
				args.splice(0, 1);
				//trigger event on the element - getElement()
				$el.trigger("fb.ui." + eventName, args);
			}
			
			return me.callParent( arguments );
		}
	});
});