define(["Firebrick.ui/fields/plugins/Radio", "Firebrick.ui/display/Header", "Firebrick.ui/display/Text", "Firebrick.ui/containers/GridColumn", "Firebrick.ui/containers/Grid", "../fields/app/Panel", "Firebrick.ui/button/ToggleButton", "../fields/app/SelectBox", "../fields/app/Radio", "../fields/app/Checkbox", "../fields/app/Table", "Firebrick.ui/table/TreeTable", "../fields/app/Username", "../fields/app/Form", "../fields/app/Description", "Firebrick.ui/fields/Email", "Firebrick.ui/button/Button"], 
		function(){
			return Firebrick.define("MyApp.views.Content", {
				extend:"Firebrick.view.Base",
				target:"#content",
				//items:response.ui,
				listeners:{
					"ready": function(){
						console.timeEnd("atime");
					}
				},
				//store:response.data
			});
});