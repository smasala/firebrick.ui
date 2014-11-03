define(["text!./Input.html", "./Base"], function(subTpl){
	return Firebrick.define("Firebrick.ui.fields.Input", {
		extend:"Firebrick.ui.fields.Base",
		uiName: "fb-ui-input",
		subTpl:subTpl,
		type:"'text'"
	})
});