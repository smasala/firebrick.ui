/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class Input
 */
define(["text!./Base.html", "text!./Input.html", "../common/Base", "x-editable", "knockout-x-editable"], function(tpl, subTpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.Input", {
		extend:"Firebrick.ui.common.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-input",
		/**
		 * @property subTpl
		 * @type {String} html
		 */
		subTpl:subTpl,
		/**
		 * @property type
		 * @type {String}
		 * @default "text"
		 */
		type:"text",
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
		 * @property formGroupClass
		 * @type {String}
		 * @default "form-group"
		 */
		formGroupClass: "form-group",
		/**
		 * show form-control class
		 * @property formControlClass
		 * @type {String}
		 * @default true
		 */
		formControlClass: true,
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
		 * @type {String}
		 * @default ""
		 */
		placeholder:"",
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
		feedbackSuccess:false,
		/**
		 * Feedback css bindings
		 * @property feedback_warning
		 * @type {Boolean|String}
		 * @default false
		 */
		feedbackWarning:false,
		/**
		 * Feedback css bindings
		 * @property feedback_error
		 * @type {Boolean|String}
		 * @default false
		 */
		feedbackError: false,
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
		 * if none specified then the name is set to that of this.type
		 * @property name
		 * @type {String}
		 * @default ""
		 */
		name:"",
		/**
		 * @method containerBindings
		 * @return {Object}
		 */
		containerBindings:function(){
			var me = this,
				obj = { 
					css: {
						"'has-success'": me.feedbackSuccess,
						"'has-warning'": me.feedbackWarning,
						"'has-error'": me.feedbackError,
						"'has-feedback'": me.feedbackSuccess || me.feedbackWarning || me.feedbackError,
						"'sr-only'": me.hideLabel
					}
				};
			if(this.inputSize){
				obj.css[me.parseBind("form-group-" + me.inputSize)] = me.inputSize ? true : false;	
			}
			return obj;
		},
		/**
		 * @method helpBlockBindings
		 * @return {Object}
		 */
		helpBlockBindings: function(){
			var me = this;
			return {
				text: me.textBind(me.helpText)
			};
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
				type =  me.parseBind( me.type ),
				obj = me.callParent(arguments);
			
			obj.attr.disabled = me.disabled;
			obj.attr.readonly = me.readOnly; 
			obj.attr.type = type;
			obj.attr.name = me.name ?  me.parseBind( me.name ) : type;
						
			obj.value = me.value;
			
			if(me.inplaceEdit){
				obj.editableOptions = {};
				obj.attr["'data-type'"] = me.dataType ?  me.parseBind( me.dataType ) : type;
				obj.editable = me.value;
				if(me.showInplaceTitle || $.fn.editable.defaults.mode !== "inline"){
					obj.attr["'data-title'"] = me.textBind( me.dataTitle || me.label );	
				}
			}else{
				obj.css["'form-control'"] = me.formControlClass;
				obj.attr.placeholder = me.textBind( me.placeholder );
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
					text: me.textBind( me.label ),
					css:{
						"'control-label'": me.controlLabel
					}
				};
			if(me.horizontal){
				obj.css[ me.parseBind("col-" + me.deviceSize + "-" + me.colLabelSize )] = me.horizontal;
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
				obj.css[ me.parseBind( "col-" + me.deviceSize + "-" + me.colInputSize ) ] = me.horizontal;
			}
			return obj;
		}
	});
});