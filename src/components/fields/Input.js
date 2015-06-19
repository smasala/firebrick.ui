/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class Input
 */
define(["knockout", "text!./Base.html", "text!./Input.html", "./Base", "../common/mixins/Items", "./plugins/InplaceEdit"], function(ko, tpl, subTpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.Input", {
		extend:"Firebrick.ui.fields.Base",
		mixins:["Firebrick.ui.common.mixins.Items"],
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.input",
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
		 * @property containerCSS
		 * @type {String}
		 * @default ""
		 */
		containerCSS: "",
		/**
		 * @property value
		 * @type {String}
		 * @default null
		 */
		value: null,
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
		 * @default "form-control"
		 */
		formControlClass: "form-control",
		/**
		 * @property labelWidth
		 * @type {Int}
		 * @default 3
		 */
		labelWidth: 3,
		/**
		 * use grid system value
		 * @property inputWidth
		 * @type {Int}
		 * @default 9
		 */
		inputWidth: 9,
		/**
		 * screen reader only
		 * @property srOnly
		 * @type {Boolean}
		 * @default false
		 */
		srOnly: false,
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
		 * type of column size -md, sm, lg etc
		 * @property columnSize
		 * @type {Boolean|String} string (sm || lg)
		 * @default "sm"
		 */
		columnSize: "md",
		/**
		 * @property inputSize
		 * @type {Boolean|String} string (sm || lg)
		 * @default "sm"
		 */
		inputSize: "md",
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
		 * @default false
		 */
		showStateIcon:false,
		/**
		 * @property formControlFeedbackClass
		 * @type {String}
		 * @default "form-control-feedback"
		 */
		formControlFeedbackClass: "form-control-feedback",
		/**
		 * input addon
		 * @property inputAddon
		 * @type {Boolean|String} - string for inputAddon text - false to deactive, true to simply activate without text, true if you just want an icon (property: iconClass)
		 * @default false
		 */
		inputAddon:false,
		/**
		 * @property inputAddonClass
		 * @type {String}
		 * @default "input-group-addon"
		 */
		inputAddonClass:"input-group-addon",
		/**
		 * @property inputAddonSpanClass
		 * @type {String}
		 * @default ""
		 */
		inputAddonSpanClass: "",
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
		 * set as true to activate or object to activate and configure
		 * @property inplaceEdit
		 * @type {Boolean|Object}
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
		 * adds html5 required attribute
		 * @property required
		 * @type {Boolean}
		 * @default false
		 */
		required:false,
		/**
		 * if none specified then the name is set to that of this.type
		 * @property name
		 * @type {String}
		 * @default ""
		 */
		name:"",
		/**
		 * @property inputAddonPosition
		 * @type {String}
		 * @default "left"
		 */
		inputAddonPosition: "left",
		/**
		 * @property _inputAddonTplId
		 * @private
		 * @type {String}
		 * @default null
		 */
		_inputAddonTplId: null,
		/**
		 * glyphicon to so in the inputAddon box
		 * @property iconClass
		 * @type {String|false}
		 * @default false
		 */
		iconClass: false,
		/**
		 * @property _lastValue
		 * @private
		 * @type {String}
		 * @default null
		 */
		_lastValue: null,
		/**
		 * if true - att "navbar-item" class to the button
		 * @property navbarItem
		 * @type {Boolean}
		 * @default false
		 */
		navbarItem: false,
		/**
		 * @method init
		 * @return .callParent(arguments)
		 */
		init: function(){
			var me = this;

				me.on("rendered", function(){
					var inplaceConf;
					
					if(me.inplaceEdit){
						inplaceConf = {
								fieldItem: me,
								showInplaceTitle: true
						};
						
						if( $.isPlainObject( me.inplaceEdit ) ){
							inplaceConf = Firebrick.utils.overwrite(inplaceConf, me.inplaceEdit);
						}
						
						Firebrick.create("Firebrick.ui.fields.plugins.InplaceEdit", inplaceConf);	
					}
					
					if(me.required){
						me.onChange();
					}
				});				
			
			
			return me.callParent(arguments);
		},
		
		/**
		 * this functions is called when the component is rendered and determines what to do when the component is changed
		 * @method onChange
		 */
		onChange: function(){
			var me = this,
				el = me.getElement(),
				container;

			if(me.required){
				if(el && el.length){
					el.change(function(){
						container = el.closest(".form-group");
						if(container.length){
							
							if(el.is(":invalid")){
								me.setStatus("error", container);
							}else{
								me.setStatus("success", container);
							}
							
						}
						
					});
				}
			}
			
		},
		
		/**
		 * use this to set a particular BS3 has-* status - e.g "has-error"
		 * @method setStatus
		 * @param name {String} "error", "warning", "success"
		 * @param element {jQuery Object} [default=getElement()] - set if you wish to set the status to a different element - e.g. like the components parent 
		 * @return self {Object}
		 */
		setStatus: function(status, element){
			var me = this,
				el = element || me.getElement();
			
			if(el && el.length){
				
				if(status){
					
					el.attr("class", function(i, str){
						str = str.replace(/(^|\s)has-\S+/g, '');	//replace all classes that start with "has-"
						str += " has-feedback";	//add the base class again (deleted by line above)
						return str;
					});
					
					el.addClass("has-" + status);
					
				}
				
			}
			
			return me;
		},
		
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
						"'sr-only'": me.srOnly
					}
				};
			
			if( me.containerCSS ){
				obj.css[ me.parseBind( me.containerCSS ) ] = true;
			}
			
			if(me.align){
				obj.css[me.parseBind("pull-" + me.align)] = true;
			}
			
			if(me.inputSize){
				obj.css[me.parseBind("form-group-" + me.inputSize)] = me.inputSize ? true : false;	
			}
			
			if(me.navbarItem){
				obj.css["'fb-ui-navbar-field'"] = true; 
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
				
				obj.css["'fb-ui-inplaceedit'"] = true;
				obj.text = me.value;
				
			}else{
				if(me.formControlClass){
					obj.css[me.parseBind(me.formControlClass)] = true;
				}
				obj.attr.placeholder = me.textBind( me.placeholder );
			}
			
			if(me.required){
				obj.attr.required = true;
			}
			
			if(me.inputSize){
				obj.css[ me.parseBind("input-" + me.inputSize) ] = true;
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
					css:{}
				};
			if(me.inputAddon){
				if($.isPlainObject(me.inputAddon)){
					
					//button has been loaded
					if(me.inputAddon.sName === "button.button"){
						//the addon is a button
						//remove if exists
						me.inputAddonClass = me.inputAddonClass.replace("input-group-addon", "");
						//add the correct class
						me.inputAddonClass += " input-group-btn";
					}
				}
				obj.css[me.parseBind(me.inputAddonClass)] = true;
			}
			return obj;
		},
		/**
		 * @method inputAddonSpanBindings
		 * @return {Object}
		 */
		inputAddonSpanBindings: function(){
			var me = this,
				obj = {css:{}};
			
			if(me.inputAddon && typeof me.inputAddon === "string"){
				obj.text = me.textBind(me.inputAddon);
			}
			
			obj.css[me.parseBind(me.glyphiconClass)] = true;
			
			if(me.iconClass){
				obj.css[me.parseBind(me.iconClass)] = true;	
			}
			
			return obj;
		},
		/**
		 * @method inputAddonTemplateBindings
		 * @return {Object}
		 */
		inputAddonTemplateBindings: function(){
			var me = this,
				obj = {
					template:me.parseBind(me.getAddonId()),
					data: "$data"
				};
			return obj;
		},
		/**
		 * 
		 * @method getAddonId
		 * @return {String} unique id
		 */
		getAddonId: function(){
			var me = this;
			
			if(!me._inputAddonTplId){
				me._inputAddonTplId = "fb-inputaddon-" + Firebrick.utils.uniqId();
			}
			
			return me._inputAddonTplId;
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
				obj.css[ me.parseBind("col-" + me.columnSize + "-" + me.labelWidth )] = me.horizontal;
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
					css:{}
				};
			if(me.horizontal){
				obj.css[ me.parseBind( "col-" + me.columnSize + "-" + me.inputWidth ) ] = me.horizontal;
			}

			return obj;
		},
		/**
		 * @method fieldBindings
		 * @return {Object}
		 */
		fieldBindings: function(){
			var me = this, 
				obj = {
					css:{
						"'input-group'": me.inputAddon ? true : false
					}
			}
			
			if(me.align){
				obj.css[me.parseBind("pull-" + me.align)] = true;
			}
			
			return obj;
		},
		
		/**
		 * @method getValue
		 * @return {Any}
		 */
		getValue: function(){
			var me = this;
			return ko.utils.unwrapObservable( me._ko.value.valueAccessor() );
		},
		/**
		 * @method setValue
		 * @event changed
		 * @return self
		 */
		setValue: function(value){
			var me = this,
				oldValue = me.getValue(),
				newValue;

			me._lastValue = oldValue;
			me._setValue(value);
			
			newValue = me.getValue();
			
			me._checkChange(newValue, oldValue);
			
			return me;
		},
		/**
		 * @event changed( newValue, oldValue )
		 * @method _checkChange
		 * @private
		 * @param newVal {Any}
		 * @param oldVal {Any}
		 * @param silent {Boolean} default=false
		 * @return {Boolean}
		 */
		_checkChange: function(newVal, oldVal, silent){
			var me = this;
			
			if( me._hasChange(newVal, oldVal) ){
				if(!silent){
					me.fireEvent("changed", newVal, oldVal);
				}
				return true;
			}
			
			return false;
		},
		/**
		 * @method _hasChange
		 * @private
		 * @param newVal {Any}
		 * @param oldVal {Any}
		 */
		_hasChange: function(newVal, oldVal){
			return newVal !== oldVal;
		},
		/**
		 * @method _setValue
		 * @private
		 */
		_setValue: function(value){
			var me = this;
			me._ko.value.valueAccessor()( value );
			return me;
		}
	});
});