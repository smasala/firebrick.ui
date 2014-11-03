define(["text!./Header.html", "../common/Base"], function(tpl){
	return Firebrick.create("Firebrick.ui.display.Header", {
		extend:"Firebrick.ui.common.Base",
		uiName:"fb-ui-header",
		tpl:tpl,
		/**
		 * @type int :: use to determine whether h1, h2, h3 etc - default(1)
		 */
		headerType:1,
		/**
		 * @type string
		 */
		headerText:"",
		/**
		 * @type string
		 */
		secondaryText:"",
		/**
		 * @type string
		 */
		labelText:"",
		/**
		 * @type false || string ::  "default", "primary", "success" "info", "warning", "danger"  
		 */
		labelCSS: "default",
		/**
		 * bindings
		 */
		bindings: function(){
			return {
				text: this.headerText
			};
		},
		
		secondaryTextBindings: function(){
			var me = this;
			if(me.secondaryText){
				return {
					text: me.secondaryText
				};
			}else{
				return {
					visible:false
				};
			}
		},
		
		labelBindings: function(){
			var me = this, 
				obj;
			if(me.labelText){
				obj = {
						text: me.labelText,
						css:{
							label: true
						}
					};
				if(me.labelCSS){
					obj.css["'label-"+me.labelCSS+"'"] = true;
				}
				return obj;
			}else{
				return {
					visible:false
				};
			}
		}
		
	});
});