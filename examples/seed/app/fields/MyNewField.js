define(["Firebrick.ui/fields/Input"], function(){
	
	return Firebrick.define("MyApp.fields.MyNewField", {
		extend:"Firebrick.ui.fields.Input",
		uiName:"myapp-field-newfield",
		placeholder:"super placeholder",
		label: "HIS is great!",
		value:"'abc'"
	});
	
});