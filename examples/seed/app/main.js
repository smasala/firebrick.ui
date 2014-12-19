require.config({
	paths: {
		"configuration": "../bower_components/firebrick.ui/src/configuration"
	},
	shim:{
		"knockout-csp": ["knockout"]
	}
});

require(["configuration"], function(){
	
	require(["jquery", "firebrick", "firebrick-ui", "bootstrap"], function(){
		
		Firebrick.ready({
			app:{
				name:"MyApp",
				path:"/app"
			},
			autoRender:false,
			cache:false,
			dev:true,
			require:["view/Content", "controller/ViewController"],
			//require: ["view/example1"],
			//require: ["view/Example2"],
			//require:["view/Example3"],
			//require:["view/Example4"],
			go: function(){
				
			}
		});
		
	});
	
});