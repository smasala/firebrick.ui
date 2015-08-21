/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Form
 */
define( [ "text!./Form.html", "jquery", "./Base" ], function( tpl, $ ) {
	"use strict";
	return Firebrick.define( "Firebrick.ui.containers.Form", {
		extend: "Firebrick.ui.containers.Base",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "containers.form",
		/**
		 * @property tpl
		 * @type {String} html
		 */
		tpl: tpl,
		/**
		 * @property formRole
		 * @type {String}
		 * @default "'form'"
		 */
		formRole: "form",
		/**
		 * controls the css class form-horizontal
		 * @property horizontal
		 * @type {Boolean|String}
		 * @default true
		 */
		horizontal: true,
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String|Function}
		 * @default ""
		 */
		html: "",
		/**
		 * controls the css class form-inline
		 * @property inline
		 * @type {Boolean|String}
		 * @default false
		 */
		inline: false,
		/**
		 * multipart/form-data for files
		 * @property enctype
		 * @type {String}
		 * @default "application/x-www-form-urlencoded"
		 */
		enctype: "application/x-www-form-urlencoded",
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
		 * set to true is you want the progress the upload/download progress to be caught
		 * when true, use myForm.addListener("progressChanged", function(percentComplete){}); to catch the value
		 * @property catchProgress
		 * @type {Boolean}
		 * @default false
		 */
		catchProgress: false,
		/**
		 * this is called before the form is submitted, use this
		 * return false to stop the submit function being called;
		 * @method preSubmit
		 * @param jquery "submit" event arguments
		 */
		preSubmit: function( event ) {
			event.preventDefault();
		},
		/**
		 * set the target attribute on the form
		 * @property formTarget
		 * @type {String}
		 * @default null
		 */
		formTarget: null,
		/**
		 * upload and download progress
		 * @event progressChanged
		 * @property xhr
		 * @type {Function}
		 */
		xhr: function() {
			var me = this,
				xhr = new window.XMLHttpRequest();

			//Upload progress
			xhr.upload.addEventListener( "progress", function( evt ) {
				if ( evt.lengthComputable ) {
					var percentComplete = evt.loaded / evt.total;
					if ( me.catchProgress ) {
						//fire the percentCompleted
						me.fireEvent( "progressChanged", percentComplete );
					}
				}
			}, false );

			//Download progress
			xhr.addEventListener( "progress", function( evt ) {
				if ( evt.lengthComputable ) {
					var percentComplete = evt.loaded / evt.total;
					if ( me.catchProgress ) {
						//fire the percentCompleted
						me.fireEvent( "progressChanged", percentComplete );
					}
				}
			}, false );

			return xhr;
		},
		/**
		 * method called on submit ajax
		 * @property success
		 * @type {Function}
		 * @default
		 */
		success: function() {
			console.info( "success", arguments );
		},
		/**
		 * method called on submit ajax
		 * @property error
		 * @type {Function}
		 * @default
		 */
		error: function() {
			console.warn( "error", arguments );
		},
		/**
		 * method called on submit ajax
		 * @property complete
		 * @type {Function}
		 * @default function(){}
		 */
		complete: function() {},
		/**
		 * method called after ajax
		 * @method always
		 * @param {Arguments} always function arguments from ajax
		 */
		always: function() {},
		/**
		 * method called after ajax
		 * @method beforeSend
		 * @param {Arguments} beforeSend function arguments from ajax
		 */
		beforeSend: function() {},
		/**
		 * this function requires the HTML5 function FormData to be supported
		 * @method getFormData
		 * @return {Object}
		 */
		getFormData: function() {
			var me = this;
			return new window.FormData( me.getElement() );
		},
		/**
		 * @method init
		 */
		init: function() {
			var me = this;
				
			me.on( "rendered", function() {
				var el = me.getElement();
				if ( el ) {
					el.on( "submit", function( ) {	//arg: event
						if ( me.preSubmit.apply( me, arguments ) !== false ) {
							me.submit();
						}
					});
				}
			});
			
			return me.callParent( arguments );
		},
		/**
		 * make sure this.url is set before calling this function
		 * @method submit
		 */
		submit: function() {
			var me = this,
				form = me.getElement();

			if ( !me.url || typeof me.url !== "string" ) {
				console.error( "unable to submit form. No url is set or is set incorrectly", me.url, me );
				return;
			}
			
			if ( !form ) {
				console.error( "unable to submit form. Form not found for id", me.getId() );
				return;
			}

			if ( window.FormData ) {
				//HTML 5 - IE10+
				$.ajax({
					xhr: me.xhr,
					url: me.url,
					type: me.submitType,
					data: new window.FormData( form[ 0 ] ),
					processData: me.ajaxProcessData,
					contentType: me.enctype,
					beforeSend: me.beforeSend.bind( me ),
					complete: me.complete.bind( me ), //regardless of success of failure
					success: me.success.bind( me ),
					error: me.error.bind( me )
				}).always( me.always.bind( me ) );
			} else {
				console.error( "FormData is not supported by your browser" );
			}
		},
		/**
		 * @method formBindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			obj.attr.role =  me.parseBind( me.formRole );
			obj.attr.enctype =  me.parseBind( me.enctype );
			obj.css[ "'form-horizontal'" ] =  me.horizontal;
			obj.css[ "'form-inline'" ] =  me.inline;
			obj.attr.action = "Firebrick.getById('" + me.getId() + "').url";
			obj.attr.method = me.parseBind( me.submitType );
			
			if ( me.formTarget ) {
				obj.attr.target = me.parseBind( me.formTarget );
			}
			
			if ( !me.items ) {
				obj.html = "Firebrick.ui.helper.getHtml( '" + me.getId() + "', $data, $context )";
			}
			
			return obj;
		}
	});
});
