define(["Firebrick.ui/fields/TextArea"], function(){
	return Firebrick.define("MyApp.fields.app.Description", {
		extend:"Firebrick.ui.fields.TextArea",
		uiName:"ui-app-description",
		label: "Description",
		value: "description"
	})
});