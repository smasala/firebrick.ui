define(["Firebrick.ui/fields/Input"], function(){
	return Firebrick.define("MyApp.fields.app.Username", {
		extend:"Firebrick.ui.fields.Input",
		uiName:"ui-app-username",
		label: "Username",
		value: "username",
		inplaceEdit:true
	});
});