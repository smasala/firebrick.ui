/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Base
 * @namespace components.fields
 * @class HtmlEditor
 */
define(["./TextArea", "summernote"], function(){
	"use strict";
	return Firebrick.define("Firebrick.ui.fields.HtmlEditor", {
		extend:"Firebrick.ui.fields.TextArea",
		/**
		 * @property sName
		 * @type {String}
		 */
		sName: "fields.htmleditor",
		/**
		 * editor configuration
		 * @property editorConf
		 * @type {Object}
		 * @default null
		 */
		editorConf: null,
		/**
		 * @method getEditorConfig
		 * @return {Object}
		 */
		getEditorConfig: function(){
			var me = this,
				editorConf = me.editorConf || {},
				obj = {
					height: 200
				};
			return Firebrick.utils.overwrite(obj, editorConf);
		},
		/**
		 * @method setValue
		 */
		_setValue: function( value ){
			return me.getElement().code( value );
		},
		/**
		 * @method getValue
		 * @return {Html}
		 */
		getValue: function(){
			return me.getElement().code();
		},
		/**
		 * @method init
		 */
		init: function(){
			var me = this;
			
			if( !me.inplaceEdit ){
				me.on("rendered", function(){
					me._initEditor();
				});
				me.on("destroy", function(){
					me.getElement().destroy();
				});
			}
			
			return me.callParent( arguments );
		},
		/**
		 * @method _initEditor
		 * @private
		 */
		_initEditor: function(){
			var me = this,
				$el = me.getElement();
				
			$el.summernote( me.getEditorConfig() ); 
		}
	});
});