define(["text!./Radio.html", "../common/MultiplesBase", "./plugins/Radio"], function(subTpl){
	return Firebrick.define("Firebrick.ui.fields.Radio", {
		extend:"Firebrick.ui.common.MultiplesBase",
		uiName:"fb-ui-radio",
		type:"'radio'",
		dataType:"'radiolist'",
		subTpl:subTpl,
		defaultChecked:"$data.checked ? $data.checked : false",
		/**
		 * @boolean or string
		 */
		options:false,
		optionLabelBindings:function(){
			var me = this;
			if(!me.inplaceEdit){
				return {
					text:"$data.label ? fb.text($data.label) : fb.text($data)"
				};
			}
			return {};
		},
		optionLabelContainerBindings:function(){
			var me = this;
			return {
				attr: {
					"for": me.inplaceEdit ? "'"+me.getId()+"'" : "itemId"
				}
			};
		},
		inputContainerBindings:function(){
			var me = this,
				obj = me.callParent();
			if(me.options && !me.inplaceEdit){
				obj.foreach = me.options;
			}
			return obj;
		},
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
			
			obj.css["'form-control'"] = false;
			if(!me.inplaceEdit){
				obj.value = "$data.value ? $data.value : $data";
				obj.attr.id = "itemId";
			}else{
				obj.attr.id = "'"+me.getId()+"'";
			}
			obj.attr.name = "'"+me.cleanString(me.type)+"-group-"+Firebrick.utils.uniqId()+"'";
			obj.checked = me.defaultChecked;
			return obj;
		}
	});
});