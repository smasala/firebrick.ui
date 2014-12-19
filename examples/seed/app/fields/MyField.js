define(["text!./MyField.html", "Firebrick.ui/fields/Input"], function(tpl){
	
	return Firebrick.define("MyApp.fields.MyField", {
		extend:"Firebrick.ui.fields.Input",
		uiName:"app-myfield",
		label:"My Field",
		tpl: tpl,
		init: function(){
			console.info(this.antrag);
			return this.callParent();
		}
	});
	
	
});