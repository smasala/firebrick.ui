/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.containers
 * @uses components.common.mixins.Items
 * @class Base
 */
define( [ "../common/Base", "../common/mixins/Items" ], function() {
	
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.containers.Base", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Items",
		bindings: function() {
			var me = this,
				obj = me.callParent( arguments );

			//property mixed in by mixins.Items
			if ( me.itemsAlign ) {
				obj.css[ me.parseBind( "fb-ui-items-align-" + me.itemsAlign ) ] = true;
			}
			
			return obj;
		}
	});
});
