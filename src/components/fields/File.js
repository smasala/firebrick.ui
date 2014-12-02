/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.fields.Input
 * @namespace components.fields
 * @class File
 */
define(["./Input"], function(){
	return Firebrick.define("Firebrick.ui.fields.File", {
		extend:"Firebrick.ui.fields.Input",
		uiName:"fb-ui-file",
		type:"file",
		formControlClass:false
	});
});