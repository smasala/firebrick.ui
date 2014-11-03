define(["text!./SelectBox.html", "jquery", "./Input"], function(subTpl, $){
	return Firebrick.create("Firebrick.ui.fields.SelectBox", {
		extend:'Firebrick.ui.fields.Input',
		uiName:"fb-ui-selectbox",
		multiSelect:false,
		subTpl:subTpl,
		data:false,
		dataType:"'select'",
		selectedOptions:false,
		optionsValue:"'value'",
		optionsText:"'text'",
		bindings:function(){
			var me = this,
				obj = me.callParent(),
				data = $.isFunction(me.data) ? me.data() : me.data;
			obj.attr.multiple = me.multiSelect;
			
			if(!me.inplaceEdit){
				obj.options = data;
				obj.selectedOptions = me.selectedOptions;
			}else{
				obj.editable = me.selectedOptions;
				obj.editableOptions = {
						optionsValue:me.optionsValue,
						optionsText:me.optionsText,
						options:data,
						type:me.dataType
				}
			}
			return obj;
		}
	})
});