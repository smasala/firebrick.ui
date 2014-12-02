require.config({
	paths:{
		"configuration": "../bower_components/firebrick.ui/src/configuration"
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
			require:["view/Content"],
			//require: ["view/example1"],
			go: function(){
			}
		});
	});
	
});