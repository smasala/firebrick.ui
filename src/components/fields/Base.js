define(["text!./Base.html", "../common/Base", "x-editable", "knockout-x-editable"], function(tpl){
	return Firebrick.define("Firebrick.ui.fields.Base", {
		extend:"Firebrick.ui.common.Base",
		uiName: "fb-ui-base",
		/**
		 * @type string
		 */
		label: "",
		/**
		 * @type string
		 */
		value: "'val'",
		/**
		 * @type string (html)
		 */
		tpl:tpl,
		/**
		 * @type string
		 */
		type:false,
		/**
		 * @type string
		 */
		formGroupClass: "form-group",
		/**
		 * @type string
		 */
		inputClass: true,
		/**
		 * @type int
		 */
		colLabelSize: 3,
		/**
		 * @type int
		 */
		colInputSize: 9,
		/**
		 * @type string
		 */
		deviceSize: "sm",
		/**
		 * @type boolean
		 */
		hideLabel: false,
		/**
		 * @type boolean
		 */
		readOnly:false,
		/**
		 * @type boolean
		 */
		disabled:false,
		/**
		 * @type false or string (sm || lg)
		 */
		inputSize:false,
		/**
		 * @type boolean
		 */
		controlLabel:true,
		/** help text **/
		/**
		 * @type boolean || string
		 */
		helpText:false,
		/**
		 * @type string
		 */
		helpBlockClass:"help-block",
		/**
		 * @type string || boolean
		 */
		placeholder:false,
		/****************/
		/**
		 * @type boolean
		 */
		showStateIcon:true,
		/**
		 * @type string
		 */
		formControlFeedbackClass: "form-control-feedback",
		/** input addon **/
		/**
		 * @type false || string
		 */
		inputAddon:false,
		/**
		 * @type string
		 */
		inputAddonClass:"'input-group-addon'",
		/******************/
		/**
		 * @type boolean
		 */
		horizontal:true,
		/**
		 * Feedback css bindings
		 * @type boolean or string 
		 */
		feedback_success:false,
		feedback_warning:false,
		feedback_error: false,
		/**
		 * @type boolean or ko string
		 */
		multiplesInline:false,
		/**
		 * @type boolean
		 */
		inplaceEdit:false,
		showInplaceTitle:true,
		/************************/
		
		/**
		 * Binding Functions
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
		
		helpBlockBindings: function(){
			return {
				text: "fb.text('" + this.helpText + "')"
			}
		},
		
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
		
		inputAddonBindings: function(){
			var me = this,
				obj = {
					text: me.inputAddon,
					css:{}
				};
			if(me.inputAddon){
				obj.css[me.inputAddonClass] = me.inputAddon;
			}
			return obj;
		},
		
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