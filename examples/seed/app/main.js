require.config({
	paths:{
		"jquery": "../bower_components/jquery/dist/jquery",
		"knockout": "../bower_components/knockoutjs/dist/knockout",
		"knockout-mapping": "../bower_components/knockout-mapping/knockout.mapping",
		"firebrick": "../bower_components/firebrick/dist/firebrick",
		"bootstrap": "../bower_components/bootstrap/dist/js/bootstrap.min",
		"text": "../bower_components/text/text",
		"firebrick-ui": "../bower_components/firebrick.ui/dist/firebrick.ui",
		"handlebars": "../bower_components/handlebars/handlebars",
		"datatables": "../bower_components/datatables/media/js/jquery.dataTables",
		"jquery-treetable": "../bower_components/jquery-treetable/jquery.treetable",
		"x-editable": "../bower_components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable",
		"fb-ui-plugins": "../bower_components/firebrick-ui/plugins",
		"knockout-x-editable": "../bower_components/knockout-x-editable/knockout.x-editable",
		"Firebrick.ui": "../bower_components/firebrick.ui/dist/components"
	},
	shim:{
		"knockout-mapping": ["knockout"],
		"bootstrap": ["jquery"],
		"datatables": ["jquery"],
		"x-editable": ["bootstrap"]
	},
	waitSeconds: 0
});

require(["firebrick", "firebrick-ui", "bootstrap", "jquery", "x-editable"], function(){
	
	Firebrick.ready({
		app:{
			name:"MyApp",
			path:"/app"
		},
		autoRender:false,
		cache:false,
		dev:true,
		require:["Firebrick.ui/display/Header", "Firebrick.ui/display/Text", "Firebrick.ui/containers/GridColumn", "Firebrick.ui/containers/Grid", "./fields/app/Panel", "Firebrick.ui/button/ToggleButton", "./fields/app/SelectBox", "./fields/app/Radio", "./fields/app/Checkbox", "./fields/app/Table", "Firebrick.ui/table/TreeTable", "./fields/app/Username", "./fields/app/Form", "./fields/app/Description", "Firebrick.ui/fields/Email", "Firebrick.ui/button/Button"],
		go: function(){

			
			$.ajax({
				url:'/app/data/form1.json',
				success:function(response){
					Firebrick.createView({
						target:"#content",
						items:response.ui,
						listeners:{
							"ready": function(){
								console.timeEnd("atime");
							}
						},
						store:response.data
					});
					
				}
			});
			
		}
	});
	
});