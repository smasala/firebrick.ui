define(["text!./ABC.html", "Firebrick.ui/containers/Form", "../fields/Superfield"], function(tpl){
	return Firebrick.defineView("MyApp.view.ABC", {
		autoRender:false,
		//tpl:tpl,
		items:[{
			uiName:"fb-ui-form",
			items:[{
				uiName:"superfield"
			}]
		}]
	});
});