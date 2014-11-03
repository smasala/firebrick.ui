define(["text!./ToggleButton.html", "../common/MultiplesBase"], function(subTpl){
	return Firebrick.create("Firebrick.ui.button.ToggleButton", {
		extend:"Firebrick.ui.common.MultiplesBase",
		uiName: "fb-ui-togglebutton",
		subTpl:subTpl,
		/**
		 * @type boolean or string
		 */
		btnGroupClass:true,
		/**
		 * @type boolean or string
		 */
		btnClass: true,
		/**
		 * @type boolean or string
		 */
		btnPrimaryClass: true,
		/**
		 * @type boolean or string
		 */
		defaultActive: false,
		/**
		 *  @type boolean or string
		 */
		dataToggle: "'buttons'",
		options:'[{text:"abc", active:true}, "b", "c", "d"]',
		/**
		 * Bindings
		 */
		btnGroupBindings: function(){
			var me = this;
			return {
				css:{
					"'btn-group'": me.btnGroupClass
				},
				attr:{
					"'data-toggle'": me.dataToggle
				},
				foreach: me.options
			}
		},
		
		toggleInputBindings: function(){
			var me = this;
			return {
				attr:{
					id: "itemId"
				}
			}
		},
		
		toggleLabelBindings: function(){
			var me = this;
			return {
				attr:{
					id: "itemId"
				},
				css:{
					btn: "$data.btnClass ? $data.btnClass : " + me.btnClass,
					"'btn-primary'": "$data.btnPrimaryClass ? $data.btnPrimaryClass : " + me.btnPrimaryClass,
					active: "$data.hasOwnProperty && $data.hasOwnProperty('active') ? $data : " + me.defaultActive 
				}
			}
		},
		
		toggleLabelTextBindings: function(){
			return {
				"text": "$data.text ? $data.text : $data"
			}
		}
	})
});