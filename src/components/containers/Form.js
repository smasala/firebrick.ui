define(["text!./Form.html", "./Base"], function(tpl){
	return Firebrick.define("Firebrick.ui.containers.Form", {
		extend:"Firebrick.ui.containers.Base",
		uiName: "fb-ui-form",
		tpl:tpl,
		/**
		 * @type string
		 */
		formRole:"'form'",
		/**
		 * @type boolean or string
		 */
		horizontal:true,
		/**
		 * @type boolean or string
		 */
		inline:false,
		
		formBindings:function(){
			var me = this;
			return {
				attr:{
					id: "'" + me.getId() + "'",
					role: me.formRole
				},
				css:{
					"'form-horizontal'": this.horizontal,
					"'form-inline'": this.inline
				}
			};
		}
	})
});