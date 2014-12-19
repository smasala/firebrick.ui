/*!
* @author Steven Masala [me@smasala.com]
*/

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class Image
 */
define(["text!./Image.html", "../common/Base", "responsive-images"], function(tpl){
	"use strict";
	return Firebrick.define("Firebrick.ui.display.Image", {
		extend:"Firebrick.ui.common.Base",
		uiName:"fb-ui-image",
		tpl: tpl,
		/**
		 * @method init
		 */
		init: function(){
			var me = this;
			me.on("rendered", function(){
				if(window.responsiveImages){
					window.responsiveImages.update(me.getId());
				}
			});
			this.callParent(arguments);
		},
		/**
		 * @property src
		 * @type {String}
		 * @default ""
		 */
		src: "",
		/**
		 * use this property for responsive images. Define in order of sizes with the largest first!
		 * @example "xl, l, m, s, xs"
		 * @property sizes
		 * @type {String} predefined sizes or media queries
		 * @default ""
		 */
		sizes: "",
		/**
		 * use this property in conjunction with "sizes" - mirror the image sizes with that of the "sizes" order
		 * @example "dogXL.jpg, dogL.jpg, dogM.jpg, dogS.jpg, dogXS.jpg"
		 * @property srcset
		 * @type {String} url(s)
		 * @default ""
		 */
		srcset: "",
		/**
		 * sets "img-responsive" to the image
		 * @property responsiveClass
		 * @type {Boolean}
		 * @default true
		 */
		responsiveClass: true,
		/**
		 * "rounded, "circle", "thumbnail"
		 * @property imgTypeClass
		 * @type {String|Boolean}
		 * @default "rounded"
		 */
		imgTypeClass: "rounded",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);
			
			obj.css["'img-responsive'"] = me.responsiveClass;

			if(me.imgTypeClass){
				obj.css[ me.parseBind( "img-"+me.imgTypeClass ) ] = true;
			}
			
			return obj;
		},
		/**
		 * @method getSizes
		 * @return {String} data-sizes="xl,s"
		 */
		getSizes: function(){
			var me = this;
			return me.sizes ? "data-sizes='" + me.sizes + "'" : "";
		},
		/**
		 * @method getSrcset
		 * @return {String} data-srcset="a.jpg, b.jpg"
		 */
		getSrcset: function(){
			var me = this;
			return me.srcset ? "data-srcset='" + me.srcset + "'" : "";
		},
		/**
		 * @method getSrc
		 * @return {String} src="a.jpg"
		 */
		getSrc: function(){
			var me = this;
			return me.src ? "src='" + me.src + "'" : "";
		}
	});
});