define([
        "store/MyStore",
        "Firebrick.ui/containers/Panel",
        "Firebrick.ui/containers/Grid",
        "Firebrick.ui/containers/GridColumn",
        "Firebrick.ui/display/Text",
        "Firebrick.ui/nav/List",
        "Firebrick.ui/nav/Navbar",
        "Firebrick.ui/table/Table",
        "fields/Superfield",
        "Firebrick.ui/fields/File",
        "Firebrick.ui/containers/Form",
        "Firebrick.ui/display/Image",
        "Firebrick.ui/display/Progress",
        "Firebrick.ui/button/Icon",
        "./ABC"],function(store){
	return Firebrick.create("MyApp.view.Example1", {
		extend:"Firebrick.view.Base",
		target:"#content",
		store:store,
		items:[{
			uiName:"fb-ui-navbar",
			data: "navs"
		},{
			uiName: "fb-ui-grid",
			items:[{
				uiName: "fb-ui-gridcol",
				columnWidth: 2,
				items:[{
					uiName: "fb-ui-navlist",
					data: "navs"
				}]
			},{
				uiName:"fb-ui-gridcol",
				columnWidth:10,
				items:[{
					uiName: "fb-ui-grid",
					items: [{
						uiName:"fb-ui-gridcol",
						columnWidth:8,
						items:[{
							uiName: "fb-ui-panel",
							title: "Main Content",
							collapsible:true,
							headerIcons:[{
								uiName:"fb-ui-icon",
								glyIcon:"plus",
								btnStyle: "primary"
							},{
								uiName:"fb-ui-icon",
								glyIcon:"remove-circle"
							}],
							items:[{
								uiName:"fb-ui-progress",
								value:80,
								label: "Complete"
							}, {
								uiName:"fb-ui-form",
								items:[{
									uiName: "fb-ui-table",
									datatable:true,
									data: "tableData"
								}]
							}]
						}]
					},{
						uiName:"fb-ui-gridcol",
						columnWidth:4,
						items:[{
							uiName:"fb-ui-image",
							sizes: "xl, l, m, s, xs",
							srcset:	"http://placehold.it/500x400&text=xl, "+
					                "http://placehold.it/400x300&text=l, "+
					                "http://placehold.it/300x200&text=m, "+
					                "http://placehold.it/200x150&text=s, "+
					                "http://placehold.it/150x100&text=xs"
		                }]
					}]
				}]
			}]
		}]
	});
});