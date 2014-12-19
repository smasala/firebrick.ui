define(["Firebrick.ui/fields/SelectBox"], function(){
	return Firebrick.define("MyApp.fields.app.SelectBox", {
		extend:"Firebrick.ui.fields.SelectBox",
		uiName:"ui-app-selectbox",
		label:"Pick a country",
		inplaceEdit:true,
		data: function(){
			return this.inplaceEdit ? "options1" : "options";
		},
		selectedOptions:"selected"
	});
});