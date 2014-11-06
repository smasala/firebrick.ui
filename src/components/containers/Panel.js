/**
 * Extends: {{#crossLink "Firebrick.ui.components.containers.Base"}}{{/crossLink}}
 * @module ui.components
 * @extends ui.components.containers.Base
 * @namespace ui.components.containers
 * @class Panel
 */
define(["text!./Panel.html", "./Base"], function(tpl){
	return Firebrick.define("Firebrick.ui.containers.Panel", {
		extend:"Firebrick.ui.containers.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-panel",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl:tpl,
		/**
		 * @property title
		 * @type {String}
		 * @default ""
		 */
		title:"",
		/**
		 * @property panelClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelClass: true,
		/**
		 * string = (default, primary, success, info, warning, danger)
		 * @property panelTypeClass
		 * @type {Boolean|String} 
		 * @default "default"
		 */
		panelTypeClass: "default",
		/**
		 * @property panelHeaderClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelHeaderClass: true,
		/**
		 * @property panelBodyClass
		 * @type {Boolean|String}
		 * @default true
		 */
		panelBodyClass: true,
		/**
		 * @property showPanelHeader
		 * @type {Boolean|String}
		 * @default true
		 */
		showPanelHeader:true,
		/**
		 * fill the panel body (can be html too)
		 * @property content
		 * @type {String}
		 * @default ""
		 */
		content: "",
		/**
		 * @property collapsible
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsible:false,
		/**
		 * @property collapsed
		 * @type {Boolean|String}
		 * @default false
		 */
		collapsed:false,
		/**
		 * Data bindings
		 * @method bindings
		 * @return {Object}
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
		/**
		 * @method tabBindings
		 * @return {Object}
		 */
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
		/**
		 * @method panelHeaderBindings
		 * @return {Object}
		 */
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
		/**
		 * @method collapsibleLinkBindings
		 * @return {Object}
		 */
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
		/**
		 * @method panelBodyBindings
		 * @return {Object}
		 */
		panelBodyBindings: function(){
			var me = this,
				obj = {
						css:{
							"'panel-body'": me.panelBodyClass
						}
					};
			
			if(!me.items && me.content){
				obj.html = me.content;
			}
			return obj;
		}
	})
});