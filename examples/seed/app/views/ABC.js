define(["text!./ABC.html"], function(tpl){
	return Firebrick.defineView("ABC", {
		autoRender:false,
		tpl:tpl
	})
});