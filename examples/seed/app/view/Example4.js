define(["../store/MyStore", "Firebrick.ui/display/Alert", "Firebrick.ui/nav/Toolbar", "Firebrick.ui/fields/Input", "Firebrick.ui/containers/Modal", "Firebrick.ui/button/Button",  "Firebrick.ui/containers/Panel", "Firebrick.ui/containers/Form"], function (s) {

    "use strict";
    
	
    window.abc = Firebrick.create("MyApp.view.Example4", {
		extend : "Firebrick.ui.containers.Panel",
		title:"Groovy",
		id:"abc",
		target: "#content",
		listeners:{
			"ready": function(){
				window.abc1 = Firebrick.create("Firebrick.ui.containers.Modal", {
					title:"hello",
					store:s,
					items:[{
						uiName:fb.ui.cmp.alert,
						title:"Oh snap! You got an error!",
						content: "Change this and that and try again. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum."
					}]
				});
			}
		},
		
		toolbars:[{
			position: "top",
			items:[{
				uiName:fb.ui.cmp.button,
				text:"Button1"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button2"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button3"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button4"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button2"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button3"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button4"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button2"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button3"
			},{
				uiName:fb.ui.cmp.button,
				text:"Button4"
			}]
		}],
		
		items:[{
			uiName:fb.ui.cmp.form,
			items:[{
				uiName:fb.ui.cmp.input, 
				name:"username",
				label:"hello",
				tooltip:"Hola Hola",
				tooltipLocation: "bottom"
			},{
				uiName:fb.ui.cmp.button,
				text:"Submit",
				type:"submit"
			}]
		}],
		store:s
	});

    return abc;
    
});