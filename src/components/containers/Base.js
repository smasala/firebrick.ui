/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.containers
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
					$.each(items, function(i,cmp){
						if(cmp.passEvent && !cmp.didit){
							cmp.passEvent(args);
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
			if($.isPlainObject(r)){
				me.items = r.items;
			}
			return r ? r.html || r : "";
		},
		/**
		 * use getItems
		 * @private
		 * @method _getItems
		 * @param {Object} items
		 * @return {Object, Null} object - {html:"", items:[]}
		 */
		_getItems: function(items){
			var me = this;
			if(items){
				if(!$.isArray(items)){
					items = [items];
				}
				return Firebrick.ui._populate(items, me);
			}
			return null;
		}
	});
});