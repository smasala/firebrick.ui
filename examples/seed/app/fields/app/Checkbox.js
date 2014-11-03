define(["Firebrick.ui/fields/Checkbox"], function(){
	return Firebrick.define("MyApp.fields.app.Checkbox", {
		extend:"Firebrick.ui.fields.Checkbox",
		uiName:"ui-app-checkbox",
		label:"Houston 123...",
		options:"options1",
		selectedOptions:"selected1",
		multiplesInline:true,
	})
});