define(["./Radio"], function(){
	return Firebrick.define("Firebrick.ui.fields.Checkbox", {
		extend:"Firebrick.ui.fields.Radio",
		uiName:"fb-ui-checkbox",
		type:"'checkbox'",
		dataType:"'checklist'",
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