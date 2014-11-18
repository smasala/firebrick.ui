/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * Base for inputs where multiple options are possible: checkboxes, radio and togglesbuttons for example
 * @module ui.components
 * @extends ui.components.fields.Input
 * @namespace ui.components.common
 * @class MultiplesBase
 */
define(["../fields/Input"], function(subTpl){
	return Firebrick.create("Firebrick.ui.common.MultiplesBase", {
		extend:"Firebrick.ui.fields.Input",
		/**
		 * @method fieldBindings
		 * @return {Object}
		 */
		fieldBindings:function(){
			var me = this;
			if(!me.inplaceEdit){
				var obj = {
					withProperties: {
							itemId: "'fb-ui-id-' + Firebrick.utils.uniqId()"
					},
					css:{}
				};
				if(me.multiplesInline){
					obj.css["'"+me.cleanString(me.type)+"-inline'"] = me.multiplesInline;
				}
				return obj;
			}
			
			return {};
		}
	});
});