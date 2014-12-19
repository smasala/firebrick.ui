define(["../store/MyStore", "Firebrick.ui/fields/Input", "Firebrick.ui/containers/Panel", "Firebrick.ui/containers/Form"], function (s) {

    "use strict";
    
	
	window.abc = new Date().getTime();
	
    return Firebrick.create("MyApp.view.Example3", {
		extend : "Firebrick.ui.containers.Panel",
		title:"Groovy",
		target: "#content",
		store:s,
		items: function(){
			 var items = [];
				for(var i = 0; i<3; i++){
					items.push({uiName:fb.ui.cmp.input, label:"hello"});
				}
				return items;
		},
		listeners:{
			"ready": function(){
				alert(new Date().getTime() - window.abc);
			}
		}
	});

    
    
});