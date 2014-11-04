define(["store/MyStore", 
        "Firebrick.ui/fields/plugins/Radio", 
        "Firebrick.ui/display/Header", 
        "Firebrick.ui/display/Text", 
        "Firebrick.ui/containers/GridColumn", 
        "Firebrick.ui/containers/Grid", 
        "../fields/app/Panel", 
        "Firebrick.ui/button/ToggleButton", 
        "../fields/app/SelectBox", 
        "../fields/app/Radio", 
        "../fields/app/Checkbox", 
        "../fields/app/Table", 
        "Firebrick.ui/table/TreeTable", 
        "../fields/app/Username", 
        "../fields/app/Form", 
        "../fields/app/Description", 
        "Firebrick.ui/fields/Email", 
        "Firebrick.ui/button/Button"
    ], function(myStore){
	
			return Firebrick.define("MyApp.views.Content", {
				extend:"Firebrick.view.Base",
				target:"#content",
				store: myStore,
				items:[{
					"uiName": "ui-app-panel",
					"title": "Hello",
					"items":[
						{
							"uiName": "ui-app-form",
							"items": [
								"fb-ui-header",
								"fb-ui-text",
								{"uiName":"ui-app-username"},
								"fb-ui-email",
								"ui-app-description",
								"ui-app-radio",
								"ui-app-checkbox",
								"ui-app-selectbox",
								"fb-ui-togglebutton",
								"ui-app-table",
								"fb-ui-treetable",
								{"uiName":"fb-ui-button", "text":"Submit"}
							]
						}	
					]
				},{
					"uiName": "fb-ui-grid",
					"items":[
						{"uiName": "fb-ui-gridcol", "columnWidth":"3", "items":["ui-app-username"]},
						{"uiName": "fb-ui-gridcol", "columnWidth":"6", "items":["ui-app-description"]},
						{"uiName": "fb-ui-gridcol", "columnWidth":"3", "items":["ui-app-username"]}
					]
				}],
				//items:response.ui,
				listeners:{
					"ready": function(){
						console.timeEnd("atime");
					}
				},
				//store:response.data
			});
});