/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.fields
 * @class Base
 */
define(["text!./Base.html", "../common/Base", "x-editable", "knockout-x-editable"], function(tpl){
	return Firebrick.define("Firebrick.ui.fields.Base", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-base",
		/**
		 * @property label
		 * @type {String}
		 * @default ""
		 */
		label: "",
		/**
		 * @property value
		 * @type {String}
		 * @default "''"
		 */
		value: "''",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl:tpl,
		/**
		 * @property type
		 * @type {String}
		 * @default false
		 */
		type:false,
		/**
		 * @property formGroupClass
		 * @type {String}
		 * @default "form-group"
		 */
		formGroupClass: "form-group",
		/**
		 * @property inputClass
		 * @type {String}
		 * @default true
		 */
		inputClass: true,
		/**
		 * @property colLabelSize
		 * @type {Int}
		 * @default 3
		 */
		colLabelSize: 3,
		/**
		 * @property colInputSize
		 * @type {Int}
		 * @default 9
		 */
		colInputSize: 9,
		/**
		 * @property deviceSize
		 * @type {String}
		 * @default "sm"
		 */
		deviceSize: "sm",
		/**
		 * @property hideLabel
		 * @type {Boolean}
		 * @default false
		 */
		hideLabel: false,
		/**
		 * @property readOnly
		 * @type {Boolean}
		 * @default false
		 */
		readOnly:false,
		/**
		 * @property disabled
		 * @type {Boolean}
		 * @default false
		 */
		disabled:false,
		/**
		 * @property inputSize
		 * @type {Boolean|String} string (sm || lg)
		 * @default false
		 */
		inputSize:false,
		/**
		 * @property controlLabel
		 * @type {Boolean}
		 * @default true
		 */
		controlLabel:true,
		/**
		 * help text
		 * @property helpText
		 * @type {Boolean|String}
		 * @default false
		 */
		helpText:false,
		/**
		 * help text
		 * @property helpBlockClass
		 * @type {String}
		 * @default "help-block"
		 */
		helpBlockClass:"help-block",
		/**
		 * @property placeholder
		 * @type {Boolean|String}
		 * @default false
		 */
		placeholder:false,
		/**
		 * @property showStateIcon
		 * @type {Boolean}
		 * @default true
		 */
		showStateIcon:true,
		/**
		 * @property formControlFeedbackClass
		 * @type {String}
		 * @default "form-control-feedback"
		 */
		formControlFeedbackClass: "form-control-feedback",
		/**
		 * input addon
		 * @property inputAddon
		 * @type {Boolean|String}
		 * @default false
		 */
		inputAddon:false,
		/**
		 * @property inputAddonClass
		 * @type {String}
		 * @default "'input-group-addon'"
		 */
		inputAddonClass:"'input-group-addon'",
		/**
		 * @property horizontal
		 * @type {Boolean}
		 * @default true
		 */
		horizontal:true,
		/**
		 * Feedback css bindings
		 * @property feedback_success
		 * @type {Boolean|String}
		 * @default false
		 */
		feedback_success:false,
		/**
		 * Feedback css bindings
		 * @property feedback_warning
		 * @type {Boolean|String}
		 * @default false
		 */
		feedback_warning:false,
		/**
		 * Feedback css bindings
		 * @property feedback_error
		 * @type {Boolean|String}
		 * @default false
		 */
		feedback_error: false,
		/**
		 * @property multiplesInline
		 * @type {Boolean|String}
		 * @default false
		 */
		multiplesInline:false,
		/**
		 * @property inplaceEdit
		 * @type {Boolean}
		 * @default false
		 */
		inplaceEdit:false,
		/**
		 * @property showInplaceTitle
		 * @type {Boolean}
		 * @default true
		 */
		showInplaceTitle:true,
		/**
		 * @method containerBindings
		 * @return {Object}
		 */
		containerBindings:function(){
			var me = this,
				obj = { 
					css: {
						"'has-success'": me.feedback_success,
						"'has-warning'": me.feedback_warning,
						"'has-error'": me.feedback_error,
						"'has-feedback'": me.feedback_success || me.feedback_warning || me.feedback_error,
						"'sr-only'": me.hideLabel
					}
				};
			if(this.inputSize){
				obj.css["'form-group-" + me.inputSize + "'"] = me.inputSize ? true : false;	
			}
			return obj;
		},
		/**
		 * @method helpBlockBindings
		 * @return {Object}
		 */
		helpBlockBindings: function(){
			return {
				text: "fb.text('" + this.helpText + "')"
			}
		},
		/**
		 * @method feedbackBindings
		 * @return {Object}
		 */
		feedbackBindings:function(){
			var me = this,
				binds = {css:{}},
				rootClass = "'glyphicon-";
			if(me.containerBindings && me.containerBindings.css){
				$.each(me.containerBindings.css, function(k,v){
					if(v){
						switch(k){
							case "'has-success'":
								binds.css[rootClass + "ok'"] = v;
								break;
							case "'has-warning'":
								binds.css[rootClass + "warning'"] = v;
								break;
							case "'has-error'":
								binds.css[rootClass + "remove'"] = v;
								break;
						}
					}
				});
			}
			return binds;
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings:function(){
			var me = this,
				obj = {
					attr:{
						disabled:me.disabled,
						readonly:me.readOnly,
						type:me.type,
						id: "'" + me.getId() + "'"
					},
					css:{},
					value: me.value
				};
			
			if(me.inplaceEdit){
				obj.editableOptions = {};
				obj.attr["'data-type'"] = me.dataType || me.type;
				obj.editable = me.value;
				if(me.showInplaceTitle || $.fn.editable.defaults.mode != "inline"){
					obj.attr["'data-title'"] = "fb.text('" + (me.dataTitle || me.label) + "')";	
				}
			}else{
				obj.css["'form-control'"] = me.inputClass;
				obj.attr.placeholder = me.placeholder
			}
			
			return obj;
		},
		/**
		 * @method inputAddonBindings
		 * @return {Object}
		 */
		inputAddonBindings: function(){
			var me = this,
				obj = {
					text: me.inputAddon,
					css:{}
				};
			if(me.inputAddon){
				obj.css[me.inputAddonClass] = true;
			}
			return obj;
		},
		/**
		 * @method labelBindings
		 * @return {Object}
		 */
		labelBindings: function(){
			var me = this,
				obj = {
					text: "fb.text('"+me.label+"')",
					css:{
						"'control-label'": me.controlLabel
					}
				};
			if(me.horizontal){
				obj.css["'col-" + me.deviceSize + "-" + me.colLabelSize + "'"] = me.horizontal;
			}
			return obj;
		},
		/**
		 * @method inputContainerBindings
		 * @return {Object}
		 */
		inputContainerBindings: function(){
			var me = this,
				obj = {
					css:{
						"'input-group'": me.inputAddon
					}
				};
			if(me.horizontal){
				obj.css["'col-" + me.deviceSize + "-" + me.colInputSize + "'"] = me.horizontal;
			}
			return obj;
		}
	});
});