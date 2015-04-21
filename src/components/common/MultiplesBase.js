/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * Base for inputs where multiple options are possible: checkboxes, radio and togglesbuttons for example
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.common
 * @class MultiplesBase
 */
define(["knockout-mapping", "../fields/Input"], function(kom){
	"use strict";
	return Firebrick.define("Firebrick.ui.common.MultiplesBase", {
		extend:"Firebrick.ui.fields.Input",
		/**
		 * @method fieldBindings
		 * @return {Object}
		 */
		fieldBindings:function(){
			var me = this,
				obj = me.callParent(arguments);
			if(!me.inplaceEdit){
				
				obj.withProperties = {
							itemId: "'fb-ui-id-' + Firebrick.utils.uniqId()"
						};

				if(me.multiplesInline){
					
					if(!obj.css){
						obj.css = {};
					}
					
					obj.css[ me.parseBind(me.cleanString(me.type)+"-inline")] = me.multiplesInline;
				}
			}
			
			return obj;
		},
		
		/**
		 * used to check which item should be selected by default
		 * @method _valueChecker
		 * @private
		 * @param $default {Any} optional
		 * @param $data {Any} value of iteration item
		 * @default {Boolean}
		 */
		_valueChecker: function($default, $data){
			var me = this;
			console.info($default, $data);
			
			if(kom.isMapped($data)){
				$data = kom.toJS($data);
			}
			
			if($.isPlainObject($data)){
				if($data.active){
					//active property wins
					return $.isFunction($data.active) ? $data.active() : $data.active;
				}else if($data.checked){
					return $.isFunction($data.checked) ? $data.checked() : $data.checked;
				}else if($data.value){
					//get the value prop
					$data = $data.value;
				}
			}

			//something to compare too
			if($default){
				//ko function?
				if($.isFunction($default)){
					$default = $default();
				}
				//compare
				return $default === $data;
			}
						
			//just return default
			return me.defaultActive;
		}
	});
});