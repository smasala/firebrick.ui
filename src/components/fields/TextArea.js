define(["text!./TextArea.html", "./Input"], function(subTpl){
	return Firebrick.define("Firebrick.ui.fields.TextArea", {
		extend:"Firebrick.ui.fields.Input",
		uiName: "fb-ui-textarea",
		rows:5,
		subTpl:subTpl,
		dataType:"'textarea'"
	})
});