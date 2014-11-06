/**
 * Extends: {{#crossLink "Firebrick.ui.components.common.Base"}}{{/crossLink}}
 * @module Firebrick.ui.components
 * @extends Firebrick.ui.components.common.Base
 * @namespace Firebrick.ui.components.containers
 * @class Base
 */
define(["jquery", "../common/Base"], function($){
	return Firebrick.define("Firebrick.ui.containers.Base", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @method init
		 */
		init:function(){
			var me = this;
			me.on("componentReady", function(){
				var items = me.items,
					args = arguments;
				if($.isArray(items)){
					$.each(items, function(i,f){
						if(f.passEvent){
							f.passEvent(args);
						}
					});
				}
			});
			me.callParent();
		},
		/**
		 * inject sub items
		 * @method getItems
		 * @return {String} html
		 */
		getItems: function(){
			var me = this,
				r = me._getItems(me.items);
			me.items = r.items;
			return r.html;
		},
		/**
		 * use getItems
		 * @private
		 * @method _getItems
		 * @param {Object} items
		 * @return {String}
		 */
		_getItems: function(items){
			var me = this;
			if(items){
				if(!$.isArray(items)){
					items = [items];
				}
				return Firebrick.ui._populate(items, me);
			}
			return "";
		}
	});
});