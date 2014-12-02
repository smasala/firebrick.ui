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
define(["jquery", "../common/Base", "../common/mixins/Items"], function($){
	return Firebrick.define("Firebrick.ui.containers.Base", {
		extend:"Firebrick.ui.common.Base",
		mixins:"Firebrick.ui.common.mixins.Items"
	});
});