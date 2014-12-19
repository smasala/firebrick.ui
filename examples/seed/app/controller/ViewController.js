define(["../store/MyStore"], function(s){
	return Firebrick.create("MyApp.controller.ViewController", {
		extend: "Firebrick.controller.Base",
		init: function(){
			var me = this;
			
			me.app.on({
				"#superbutton1": {
					click: me.showModal
				},
				scope: me
			})
			
			return me.callParent(arguments);
		},
		
		showModal: function(){
			Firebrick.create("Firebrick.ui.containers.Modal", {
				title:"Modal with an alert box",
				store:s,
				items:[{
					uiName:fb.ui.cmp.alert,
					title:"Oh snap! You got an error!",
					content: "Change this and that and try again. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum."
				}]
			});
		}
	})
});