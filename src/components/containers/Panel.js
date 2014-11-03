define(["text!./Panel.html", "./Base"], function(tpl){
	return Firebrick.define("Firebrick.ui.containers.Panel", {
		extend:"Firebrick.ui.containers.Base",
		uiName: "fb-ui-panel",
		tpl:tpl,
		/**
		 * @type string
		 */
		title:"",
		/**
		 * @type boolean || string
		 */
		panelClass: true,
		/**
		 * @type false || string (default, primary, success, info, warning, danger)
		 */
		panelTypeClass: "default",
		/**
		 * @type boolean || string
		 */
		panelHeaderClass: true,
		/**
		 * @type boolean || string
		 */
		panelBodyClass: true,
		/**
		 * @type boolean || string
		 */
		showPanelHeader:true,
		/**
		 * @type string - fill the panel body (can be html too)
		 */
		content: "",
		/**
		 * @type boolean || string
		 */
		collapsible:false,
		/**
		 * @type boolean || string
		 */
		collapsed:false,
		/**
		 * Data bindings
		 */
		bindings: function(){
			var me = this,
				obj = {
						attr:{
							id: "'" + me.getId() + "'",
						},
						css:{
							"panel": me.panelClass
						}
					};
			if(me.panelTypeClass){
				obj.css["'panel-"+me.panelTypeClass+"'"] = true;
			}
			return obj;
		},
		
		tabBindings: function(){
			var me = this,
				obj = {
					css:{},
					attr:{
						id:"'fb-ui-collapse-" + me.getId() + "'"
					}
			};
			if(me.collapsible){
				obj.css["'panel-collapse'"] = me.collapsible;
				obj.css["collapse"] = me.collapsible;
				if(!me.collapsed){
					obj.css["in"] = true;
				}
			}
			return obj;
		},
		
		panelHeaderBindings: function(){
			var me = this,
				obj = {
					css:{
						"'panel-heading'": me.panelHeaderClass
					},
					visible: me.showPanelHeader
				};
			if(!me.collapsible){
				obj.text = "fb.text('" + me.title + "')";
			}
			return obj;
		},
		
		collapsibleLinkBindings: function(){
			var me = this,
				id = "fb-ui-collapse-" + me.getId();
			return {
				attr:{
					"'data-toggle'": "'collapse'",
					"href": "'#" + id + "'",
					"'aria-expanded'": typeof me.collapsed == "boolean" ? me.collapsed : true,
					"'aria-controls'": "'" + id + "'",
				},
				text: "fb.text('" + me.title + "')"
			}
		},
		
		panelBodyBindings: function(){
			var me = this,
				obj = {
						css:{
							"'panel-body'": me.panelBodyClass
						}
					};
			
			if(!me.items){
				obj.html = me.content;
			}
			return obj;
		}
	})
});