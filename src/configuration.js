/*!
 * Firebrick UI Dependency Configuration
 * @author Steven Masala [me@smasala.com]
**/

define(function(_require, _exports, _module){
	"use strict";
	var bowerPath = _module.config().bowerPath || "bower_components";
	return require.config({
		paths:{
			"jquery": bowerPath + "/jquery/dist/jquery",
			"knockout": bowerPath + "/knockoutjs/dist/knockout.debug",
			"knockout-mapping": bowerPath + "/knockout-mapping/knockout.mapping",
			"firebrick": bowerPath + "/firebrick/src/firebrick",
			"bootstrap": bowerPath + "/bootstrap/dist/js/bootstrap",
			"bootstrap.plugins": bowerPath + "/bootstrap/js",
			"text": bowerPath + "/text/text",
			"firebrick-ui": bowerPath + "/firebrick.ui/src/firebrick.ui",
			"doT": bowerPath + "/doT/doT",
			"datatables": bowerPath + "/datatables/media/js/jquery.dataTables",
			"jquery-treetable": bowerPath + "/jquery-treetable/jquery.treetable",
			"Firebrick.ui": bowerPath + "/firebrick.ui/src/components",
			"responsive-images": bowerPath + "/responsive-images/src/responsiveimages",
			"responsive-tables-js": bowerPath + "/responsive-tables-js/src/responsivetables",
			"devicejs": bowerPath + "/devicejs/lib/device",
			"Firebrick.ui.engines": bowerPath + "/firebrick.ui/src/engines",
			"bootstrap-datepicker": bowerPath + "/bootstrap-datepicker/js/bootstrap-datepicker"
		},
		shim:{
			"knockout-mapping": ["knockout"],
			"bootstrap": ["jquery"],
			"datatables": ["jquery"],
			"x-editable": ["bootstrap"],
			"responsive-images": ["jquery"],
			"responsive-tables-js": ["jquery"],
			"popover": ["tooltip"]
		}
	});	
});