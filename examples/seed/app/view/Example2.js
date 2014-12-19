define(["../store/MyStore", "Firebrick.ui/nav/Navbar", "./SuperContent"], function (store) {
	
    "use strict";
    
	return Firebrick.create("MyApp.view.Example2", {
		extend: "Firebrick.view.Base",
		target: "#content",
		store: store,
		items: [{
			uiName: "fb-ui-navbar",
			data: "navs"
		}, {
			viewName: "MyApp.view.SuperContent"
		}]
		
		
	});
	
});