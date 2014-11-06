/**
 * Extends: {{#crossLink "Firebrick.ui.components.containers.Base"}}{{/crossLink}}
 * @module ui.components
 * @extends ui.components.containers.Base
 * @namespace ui.components.containers
 * @class Grid
 */
define(["text!./Grid.html", "jquery", "./Base"], function(tpl, $){
	return Firebrick.create("Firebrick.ui.containers.Grid", {
		extend:"Firebrick.ui.containers.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-grid",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @property rowClass
		 * @type {Boolean|String}
		 * @default true
		 */
		rowClass:true,
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this;
			return {
				css: {
					row: me.rowClass
				},
				attr:{
					id: "'" + me.getId() + "'"
				}
			}
		},
		/**
		 * @method getBasicBindings
		 * @return {Object}
		 */
		getBasicBindings:function(){
			var me = this;
				obj = {
						css:{}
				};
			obj.css["'col-md-" + (Math.floor(12/me.items.length)) + "'"] = true;
			return obj;
		},
		/**
		 * used when calling {{{getGridItem}}} in template
		 * @method getGridItem
		 * @param {Int} iteration index
		 * @param {Object} iteration object
		 * @param {Context} iteration context
		 * @return {String}
		 */
		getGridItem: function(index, item, context){
			var me = context.data.root,
				newItem = me._getItems(item);
			
			me.items[index] = newItem.items[0];
			
			if(!$.isPlainObject(item)){
				return '<div data-bind="' + Firebrick.ui.utils.stringify(me.getBasicBindings()) + '">' + newItem.html + '</div>';
			}
			
			return newItem.html;
		}
	});
});