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
        "Firebrick.ui/button/Icon",
        "Firebrick.ui/display/Progress",
        "Firebrick.ui/display/Image",
        "Firebrick.ui/containers/Box",
        "Firebrick.ui/fields/File",
        "Firebrick.ui/containers/Modal",
        "Firebrick.ui/display/Alert",
        "./ABC"
    ], function(myStore){
	
			return Firebrick.create("MyApp.view.Content", {
				extend:"Firebrick.view.Base",
				target:"#content",
				store: myStore,
				items:[{
					uiName: "fb-ui-navbar",
					items:[{
						uiName: fb.ui.cmp.navlist,
						data: "navs"
					}]
				},{
					uiName: fb.ui.cmp.grid,
					items:[{
						uiName: fb.ui.cmp.gridcol,
						columnWidth: 2,
						items:[{
							uiName: "fb-ui-navlist",
							data: "navs"
						},{
							uiName:"fb-ui-box",
							items:[{
								uiName:"fb-ui-button",
								items:[{
									uiName: "fb-ui-dropdown-list",
									data: "navs1"
								}],
								text:"Dropdown"
							}]
						}]
					},{
						uiName:fb.ui.cmp.gridcol,
						columnWidth:10,
						items:[{
							uiName: fb.ui.cmp.grid,
							items: [{
								uiName:fb.ui.cmp.gridcol,
								columnWidth:8,
								items:[{
									uiName: "fb-ui-panel",
									title: "Main Content",
									collapsible:true,
									toolbars:[{
										position: "top",
										items:[{
											uiName:fb.ui.cmp.button,
											text:"Click me!!",
											id:"superbutton1"
										},{
											uiName:fb.ui.cmp.button,
											text:"Toolbar Button 2"
										},{
											uiName:fb.ui.cmp.button,
											text:"Toolbar Button 3"
										}]
									}],
									headerIcons:[{
										uiName:"fb-ui-icon",
										glyIcon:"home",
										btnStyle: "info",
										text: " HIS"
									},{
										uiName:"fb-ui-icon"
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
								uiName:fb.ui.cmp.gridcol,
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
				},{
					uiName: "fb-ui-panel",
					panelTypeClass: "primary",
					title: "Hello",
					items:[
				        {
				        	uiName: "fb-ui-breadcrumbs",
				        	"data": "simplelist"
				        },{
				        	uiName: "fb-ui-pagination",
				        	"data": "simplelist"
				        },{
							uiName: "ui-app-form",
							items: [
								fb.ui.cmp.header,
								fb.ui.cmp.text,
								fb.ui.cmp.file,
								{uiName:"ui-app-username"},
								{uiName:"ui-app-username", "inplaceEdit": false},
								"ui-app-description",
								"ui-app-radio",
								"ui-app-checkbox",
								"ui-app-selectbox",
								{uiName: "fb-ui-togglebutton", "label": "Toggle!", "options": "options"},
								"ui-app-table",
								{uiName:"fb-ui-button", "text":"Submit"}
							]
						}	
					]
				},{
					uiName: "fb-ui-panel",
					title: "Fancy Table",
					items:[{
						uiName: "ui-app-table",
						"datatable": true
					}]
				},{
					uiName: "fb-ui-panel",
					title: "Another Fancy Table",
					panelTypeClass: "danger", 
					items:[{
						uiName: "fb-ui-treetable",
						"data": "treeTableData"
					}]
				},{
					uiName: "fb-ui-panel",
					title: "A Gird with Columns",
					panelTypeClass: "success", 
					toolbars:[{
						position: "bottom",
						items:[{
							uiName:fb.ui.cmp.button,
							text:"Toolbar Button 1"
						},{
							uiName:fb.ui.cmp.button,
							text:"Toolbar Button 2"
						},{
							uiName:fb.ui.cmp.button,
							text:"Toolbar Button 3"
						}]
					}],
					items: [{
						uiName: fb.ui.cmp.grid,
						items:[
							{uiName: fb.ui.cmp.gridcol, "columnWidth":"3", items:["ui-app-username"]},
							{uiName: fb.ui.cmp.gridcol, "columnWidth":"6", items:["ui-app-description"]},
							{uiName: fb.ui.cmp.gridcol, "columnWidth":"3", items:["ui-app-username"]}
						]
					}]
				},{
					uiName: "fb-ui-panel",
					title: "Testing 123",
					id: "testpanel",
					items:[{
						viewName: "MyApp.view.ABC"
					}]
				},{
					uiName: "fb-ui-panel",
					title: "A list in a panel! Wow!",
					items:[{uiName: fb.ui.cmp.list, data:"list"}]
				}]
			});
});