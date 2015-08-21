/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 *
 * do not extend from this but from Firebrick.ui.button.ButtonGroup
 *
 * @private
 *
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.button
 * @class ButtonGroupBase
 */
define( [ "../common/Base", "../common/mixins/Items" ], function() {
	"use strict";
	
	return Firebrick.define( "Firebrick.ui.button.Base", {
		extend: "Firebrick.ui.common.Base",
		mixins: "Firebrick.ui.common.mixins.Items"
	});
	
});
