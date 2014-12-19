define(["../store/MyStore",
        "Firebrick.ui/containers/Panel",
        "Firebrick.ui/fields/Input",
        "Firebrick.ui/fields/Textarea",
        "Firebrick.ui/fields/File",
        "Firebrick.ui/containers/Form",
        "Firebrick.ui/containers/Grid",
        "Firebrick.ui/containers/GridColumn",
        "Firebrick.ui/nav/List",
        "Firebrick.ui/nav/Navbar", 
        "Firebrick.ui/button/Icon",
        "Firebrick.ui/table/Table",
        "../fields/MyNewField"], function(store){
	
	return Firebrick.defineView("MyApp.view.SuperContent", {
		autoRender:false,
		store: store,
		items:[{
			uiName:"fb-ui-grid",
			items:[{
				uiName:"fb-ui-gridcol",
				columnWidth:"3",
				items:[{
					uiName:"fb-ui-navlist",
					data:"navs"
				}]
			},{
				uiName:"fb-ui-gridcol",
				columnWidth:9,
				items:[{
					uiName:"fb-ui-panel",
					title:"Super Panel Title",
					headerIcons:[{
						uiName:"fb-ui-icon",
						glyIcon:"off",
						text:"Turn Me Off",
						btnStyle:"primary"
					},{
						uiName:"fb-ui-icon",						
					}],
					items:[{
						uiName:"fb-ui-form",
						items:["myapp-field-newfield",{
							uiName:"fb-ui-input",
							label:"Username",
							placeholder:"something nice"
						},{
							uiName:"fb-ui-textarea",
							label:"Description",
							placeholder:"how cool are you?"
						},{
							uiName:"fb-ui-file",
							label:"Upload"
						}]
					},{
						uiName:"fb-ui-table",
						data:"tableData",
						datatable:true
					}]
				}]
			}]
		}]
	});
	
});