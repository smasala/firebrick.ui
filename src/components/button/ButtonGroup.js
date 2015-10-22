/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 *
 * the items property does not need to have each object defined with its sName, that is down automatically
 *
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.button
 * @class ButtonGroup
 */
define( [ "text!./ButtonGroup.html", "./Base", "./Button" ], function( tpl ) {
	"use strict";

	return Firebrick.define( "Firebrick.ui.button.ButtonGroup", {
		extend: "Firebrick.ui.button.Base",
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-buttongroup"
		 */
		sName: "button.buttongroup",
		tpl: tpl,
		defaults: {
			sName: "button.button",
			dropdownContainerClass: "btn-group" //needed for dropdown
		},
		/**
		 * @property vertical
		 * @type {Boolean} if false then the button group is horizontal
		 * @default true
		 */
		vertical: true,
		/**
		 * @property role
		 * @type {String}
		 * @default "group"
		 */
		role: "group",
		/**
		 * @property groupSize
		 * @type {String} xs, sm, md, lg
		 * @default "md"
		 */
		groupSize: "md",
		/**
		 * @property arialLabel
		 * @type {String}
		 * @default ""
		 */
		arialLabel: "",
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );
			
			if ( me.vertical ) {
				obj.css[ "'btn-group-vertical'" ] = true;
			} else {
				obj.css[ "'btn-group'" ] = true;
			}
			
			obj.css[ me.parseBind( "btn-group-" + me.groupSize ) ] = true;
			obj.attr.role = me.parseBind( me.role );
			obj.attr[ "'aria-label'" ] = me.textBind( "arialLabel" );
			
			return obj;
		}
	});
});
		