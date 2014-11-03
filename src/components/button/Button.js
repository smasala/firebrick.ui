define(["text!./Button.html", "../common/Base"], function(tpl){
	return Firebrick.create("Firebrick.ui.button.Button", {
		extend:"Firebrick.ui.common.Base",
		uiName: "fb-ui-button",
		tpl:tpl,
		text:"",
		/**
		 * @type false || string ("sm", "lg", "xs")
		 */
		btnSize:false,
		/**
		 * @type false || string (default, primary, success, info, warning, danger, link)
		 */
		btnStyle:"default",
		
		/*****************/
		bindings: function(){
			var me = this,
				obj = {
					type: "button",
					text: "fb.text('" + me.text + "')",
					css:{
						"'btn'": true
					}
				}
			if(me.btnStyle){
				obj.css["'btn-"+me.btnStyle+"'"] = true;
			}
			if(me.btnSize){
				obj.css["'btn-" + me.btnSize + "'"] = true;
			}
			return obj;
		}
	})
});