/**
 * Extends: {{#crossLink "Firebrick.ui.components.fields.Radio"}}{{/crossLink}}
 * @module ui.components
 * @extends ui.components.fields.Radio
 * @namespace ui.components.fields
 * @class Checkbox
 */
define(["./Radio"], function(){
	return Firebrick.define("Firebrick.ui.fields.Checkbox", {
		extend:"Firebrick.ui.fields.Radio",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName:"fb-ui-checkbox",
		/**
		 * @property type
		 * @type {String}
		 * @default "'checkbox'"
		 */
		type:"'checkbox'",
		/**
		 * @property dataType
		 * @type {String}
		 * @default "'checklist'"
		 */
		dataType:"'checklist'",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings:function(){
			var me = this,
				obj = me.callParent();

			if(me.inplaceEdit){
				obj.editable = me.selectedOptions || false;
				obj.editableOptions = {
						optionsValue:"'value'",
						optionsText:"'text'",
						options:me.options,
						type:me.dataType
				};
			}
			
	
			return obj;
		}
	});
});