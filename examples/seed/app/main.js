require.config({
	paths:{
		"dependencies": "../bower_components/firebrick.ui/src/dependencies"
	}
});

require(["dependencies"], function(){
	
	require(["jquery", "firebrick", "firebrick-ui", "bootstrap"], function(){
		Firebrick.ready({
			app:{
				name:"MyApp",
				path:"/app"
			},
			autoRender:false,
			cache:false,
			dev:true,
			require:["views/Content"],
			go: function(){
				Firebrick.create("MyApp.views.Content");
			}
		});
	});
	
});