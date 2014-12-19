/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Form
 */
define(["text!./Form.html", "jquery", "./Base"], function(tpl, $){
	"use strict";
	return Firebrick.define("Firebrick.ui.containers.Form", {
		extend:"Firebrick.ui.containers.Base",
		/**
		 * @property uiName
		 * @type {String}
		 */
		uiName: "fb-ui-form",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl:tpl,
		/**
		 * @property formRole
		 * @type {String}
		 * @default "'form'"
		 */
		formRole:"form",
		/**
		 * @property horizontal
		 * @type {Boolean|String}
		 * @default true
		 */
		horizontal:true,
		/**
		 * @property inline
		 * @type {Boolean|String}
		 * @default false
		 */
		inline:false,
		/**
		 * @property enctype
		 * @type {String}
		 * @default "multipart/form-data"
		 */
		enctype: "multipart/form-data",
		/**
		 * whether the progress bar should be shown on form submission
		 * @property showProgress
		 * @type {Boolean}
		 * @default true
		 */
		showProgress: true,
		/**
		 * see "ProcessData" in http://api.jquery.com/jquery.ajax/
		 * @property ajaxProcessData
		 * @type {Boolean}
		 * @default true
		 */
		ajaxProcessData: false,
		/**
		 * used for submitting the form
		 * @property url
		 * @type {String}
		 * @default ""
		 */
		url: "/",
		/**
		 * @property submitType
		 * @type {String}
		 * @default "post"
		 */
		submitType: "post",
		/**
		 * upload and download progress
		 * @property xhr
		 * @type {Function}
		 */
		xhr: function(){
			var xhr = new window.XMLHttpRequest();

			//Upload progress
		    xhr.upload.addEventListener("progress", function(evt){
		    	if (evt.lengthComputable) {
		    		var percentComplete = evt.loaded / evt.total;
		    		//Do something with upload progress
		    		console.log(percentComplete);
		    	}
		    }, false);
		    
		    //Download progress
		    xhr.addEventListener("progress", function(evt){
		    	if (evt.lengthComputable) {
		    		var percentComplete = evt.loaded / evt.total;
		    		//Do something with download progress
		    		console.log(percentComplete);
		    	}
		    }, false);
		    
		    return xhr;
		},
		/**
		 * stores the current form item
		 * @property _form
		 * @type {jQuery Object} <form></form>
		 */
		_form: null,
		/**
		 * method called on submit ajax
		 * @property success
		 * @type {Function}
		 * @default 
		 */
		success: function(){
			console.info("success");
		},
		/**
		 * method called on submit ajax
		 * @property failure
		 * @type {Function}
		 * @default 
		 */
		failure: function(){
			console.info("failure");
		},
		/**
		 * method called on submit ajax
		 * @property complete
		 * @type {Function}
		 * @default function(){}
		 */
		complete: function(){},
		/**
		 * method called after ajax
		 * @method always
		 * @param {Arguments} always function arguments from ajax
		 */
		always: function(){},
		/**
		 * method called after ajax
		 * @method beforeSend
		 * @param {Arguments} beforeSend function arguments from ajax
		 */
		beforeSend: function(){},
		/**
		 * this function requires the HTML5 function FormData to be supported
		 * @method getFormData
		 * @return {Object}
		 */
		getFormData: function(){
			var me = this;
			return new window.FormData(me.getElement());
		},
		/**
		 * @method init
		 */
		init: function(){
			var me = this;
				
			me.on("rendered", function(){
				me._form = me.getElement();
			});
			
			return me.callParent(arguments);
		},
		/**
		 * make sure this.url is set before calling this function
		 * @method submit
		 */
		submit: function(){
			var me = this;

			if(!me.url || typeof me.url !== "string"){
				console.error("unable to submit form. No url is set or is set incorrectly", me.url, me);
				return;
			}
			
			if(!me._form){
				console.error("unable to submit form. Form not found for id", me.getId());
			}
			
			if(window.FormData){
				//HTML 5 - IE10+ 
				$.ajax({
					xhr: me.xhr,
					url: me.url, 
					type: me.submitType, 
					data: new window.FormData(me._form[0]), 
					processData: me.ajaxProcessData, 
					contentType: me.enctype,
					beforeSend: me.beforeSend.bind(me),
					complete: me.complete.bind(me), //regardless of success of failure
					success: me.success.bind(me),
					failure: me.failure.bind(me)
				}).always(me.always.bind(me));
			}else{
				console.error("FormData is not supported by your browser");
			}
		},
		/**
		 * @method formBindings
		 * @return {Object}
		 */
		bindings:function(){
			var me = this,
				obj = {css:{},attr:{}};
			
			obj.attr.role =  me.parseBind(me.formRole);
			obj.attr.enctype =  me.parseBind(me.enctype);
			obj.css["'form-horizontal'"] =  me.horizontal;
			obj.attr["'form-inline'"] =  me.inline;
			
			return obj;
		}
	});
});