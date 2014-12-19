define(function(){
	return Firebrick.createStore("MyApp.store.MyStore", {
		autoLoad:true,
		//TODO:
		url:"/app/data/form1.json",
		data:{
			bewerber:123
		}
	})
});