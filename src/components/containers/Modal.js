/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.containers.Base
 * @namespace components.containers
 * @class Modal
 */
define(["text!./Modal.html", "./Base"], function(tpl){
	"use strict";
	
	return Firebrick.define("Firebrick.ui.containers.Modal", {
		extend:"Firebrick.ui.containers.Base",
		tpl: tpl,
		target:"body",
		appendTarget: true,
		sName:"containers.modal",
		init: function(){
			var me = this;
			me.on("rendered", function(){
				if(me.showOnCreate){
					me.showMe();	
				}
				me.getElement().on("hidden.bs.modal", function(){
					me.destroy();
				});
			});
			return me.callParent(arguments);
		},
		enclosedBind:true,
		passToProperties:{
			footerItems:1
		},
		/**
		 * show the modal
		 * @method showMe
		 * @return {Object} self
		 */
		showMe: function(){
			var me = this,
				modal = me.getElement();
			if(modal){
				modal.modal();
			}
		},
		/**
		 * @property ariaDescribedBy
		 * @type {String}
		 * @default ""
		 */
		ariaDescribedBy: "",
		/**
		 * if true - the modal will popup after .create() has been called
		 * @property showOnCreate
		 * @type {Boolean}
		 * @default false
		 */
		showOnCreate: true,
		/**
		 * @property title
		 * @type {String}
		 * @default ""
		 */
		title:"",
		/**
		 * store property key
		 * @property storeProp
		 * @type {String}
		 * @default ""
		 */
		storeProp: "",
		/**
		 * fill the panel body with html
		 * @property html
		 * @type {String}
		 * @default ""
		 */
		html: "",
		/**
		 * @property titleClass
		 * @type {Boolean}
		 * @default true
		 */
		titleClass: true,
		/**
		 * @property bodyClass
		 * @type {Boolean}
		 * @default true
		 */
		bodyClass: true,
		/**
		 * @property animationClass
		 * @type {String}
		 * @default "fade"
		 */
		animationClass: "fade",
		/**
		 * @property dialogClass
		 * @type {Boolean}
		 * @default true
		 */
		dialogClass: true,
		/**
		 * @property contentClass
		 * @type {Boolean}
		 * @default true
		 */
		contentClass: true,
		/**
		 * @property headerClass
		 * @type {Boolean}
		 * @default true
		 */
		headerClass: true,
		/**
		 * @property isModal
		 * @type {Boolean}
		 * @default true
		 */
		isModal: true,
		/**
		 * @property footerClass
		 * @type {Boolean}
		 * @default true
		 */
		footerClass: true,
		/**
		 * used to created the <h{int}></h{int}> tags in the header
		 * @property titleSize
		 * @type {Integer}
		 * @default 4
		 */
		titleSize:4,
		/**
		 * @property showCloseIcon
		 * @type {Boolean}
		 * @default true
		 */
		showCloseIcon: true,
		/**
		 * screen reader text
		 * @property srCloseText
		 * @type {String}
		 * @default "Close"
		 */
		srCloseText: "Close",
		/**
		 * @method srCloseIconBindings
		 * @return {Object}
		 */
		srCloseIconBindings: function(){
			var me = this;
			return {
				css:{
					"'sr-only'": true
				},
				text: me.parseBind(me.srCloseText)
			};
		},
		/**
		 * @method closeButtonBindings
		 * @return {Object}
		 */
		closeButtonBindings: function(){
			return {
				attr:{
					type: "'button'",
					"'data-dismiss'": "'modal'"
				},
				css:{
					close: true
				}
			};
		},
		/**
		 * @method getTitleId
		 * @return {String}
		 */
		getTitleId: function(){
			return "fb-modal-title-" + this.getId();
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = this.callParent();
			
			obj.css.modal = me.isModal;
			
			obj.attr["'aria-labelledby'"] = me.parseBind(me.getTitleId());
			obj.attr["'aria-describedby'"] = me.parseBind(me.ariaDescribedBy);
			obj.attr.role = "'dialog'";
			obj.attr.tabindex = -1;
			obj.attr["'aria-hidden'"] = true;
			
			if(me.animationClass){
				obj.css[me.animationClass] = true;
			}
			
			return obj;
		},
		/**
		 * @method dialogBindings
		 * @return {Object}
		 */
		dialogBindings: function(){
			var me = this;
			return {
				css: {
					"'modal-dialog'": me.dialogClass
				}
			};
		},
		/**
		 * @method contentBindings
		 * @return {Object}
		 */
		contentBindings: function(){
			var me = this;
			return {
				css: {
					"'modal-content'": me.contentClass
				}
			};
		},
		/**
		 * @method headerBindings
		 * @return {Object}
		 */
		headerBindings: function(){
			var me = this;
			return {
				css: {
					"'modal-header'": me.headerClass
				}
			};
		},
		/**
		 * @method titleBindings
		 * @return {Object}
		 */
		titleBindings: function(){
			var me = this;
			return {
				text: me.textBind( me.title ),
				css: {
					"'modal-title'": me.titleClass
				}
			};
		},
		/**
		 * @method bodyBindings
		 * @return {Object}
		 */
		bodyBindings: function(){
			var me = this, 
				obj ={
					css:{
						"'modal-body'": me.bodyClass
					}
				};
			
			if(!me.items){
				if(me.storeProp){
					obj.html = me.storeProp;
				}else{
					obj.html = "Firebrick.getById('"+me.getId()+"').html";
				}
			}
			
			return obj;
		},
		/**
		 * @method footerBindings
		 * @return {Object}
		 */
		footerBindings: function(){
			var me = this;
			return {
				css:{
					"'modal-footer'": me.footerClass
				}
			};
		}
	});
	
});