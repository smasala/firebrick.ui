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
        "Firebrick.ui/button/Button",
        "Firebrick.ui/display/List",
        "Firebrick.ui/nav/Navbar",
        "Firebrick.ui/nav/Breadcrumbs",
        "Firebrick.ui/nav/Pagination",
        "./ABC"
    ], function(myStore){
	
			return Firebrick.define("MyApp.views.Content", {
				extend:"Firebrick.view.Base",
				target:"#content",
				store: myStore,
				items:[{
					"uiName": "fb-ui-navbar",
					"data": "navs"
				},{
					"uiName": "ui-app-panel",
					"panelTypeClass": "primary",
					"title": "Hello",
					"items":[
				        {
				        	"uiName": "fb-ui-breadcrumbs",
				        	"data": "simplelist"
				        },{
				        	"uiName": "fb-ui-pagination",
				        	"data": "simplelist"
				        },{
							"uiName": "ui-app-form",
							"items": [
								"fb-ui-header",
								"fb-ui-text",
								{"uiName":"ui-app-username"},
								{"uiName":"ui-app-username", "inplaceEdit": false},
								"ui-app-description",
								"ui-app-radio",
								"ui-app-checkbox",
								"ui-app-selectbox",
								{"uiName": "fb-ui-togglebutton", "label": "Toggle!", "options": "options"},
								"ui-app-table",
								{"uiName":"fb-ui-button", "text":"Submit"}
							]
						}	
					]
				},{
					"uiName": "ui-app-panel",
					"title": "Fancy Table",
					"items":[{
						"uiName": "ui-app-table",
						"datatable": true
					}]
				},{
					"uiName": "ui-app-panel",
					"title": "Another Fancy Table",
					"panelTypeClass": "danger", 
					"items":[{
						"uiName": "fb-ui-treetable",
						"data": "treeTableData"
					}]
				},{
					"uiName": "ui-app-panel",
					"title": "A Gird with Columns",
					"panelTypeClass": "success", 
					"items": [{
						"uiName": "fb-ui-grid",
						"items":[
							{"uiName": "fb-ui-gridcol", "columnWidth":"3", "items":["ui-app-username"]},
							{"uiName": "fb-ui-gridcol", "columnWidth":"6", "items":["ui-app-description"]},
							{"uiName": "fb-ui-gridcol", "columnWidth":"3", "items":["ui-app-username"]}
						]
					}]
				},{
					"uiName": "ui-app-panel",
					"title": "Testing 123",
					"id": "testpanel",
					items:[{
						"viewName": "ABC"
					}]
				},{
					"uiName": "ui-app-panel",
					"title": "A list in a panel! Wow!",
					items:[{"uiName": "fb-ui-list", data:"list"}]
				}],
				//items:response.ui,
				listeners:{
					"ready": function(){
						console.timeEnd("atime");
					}
				}
				//store:response.data
			});
});