/*!
 * Firebrick UI Dependency Configuration
 * @author Steven Masala [me@smasala.com]
**/

define(function(_require, _exports, _module){
	"use strict";
	var bowerPath = _module.config().bowerPath || "bower_components";
	return require.config({
		paths:{
			"jquery": bowerPath + "/jquery/dist/jquery.min",
			"knockout": bowerPath + "/knockoutjs/dist/knockout.debug",
			"knockout-mapping": bowerPath + "/knockout-mapping/knockout.mapping",
			"firebrick": bowerPath + "/firebrick/dist/firebrick",
			"bootstrap": bowerPath + "/bootstrap/dist/js/bootstrap.min",
			"bootstrap.plugins": bowerPath + "/bootstrap/js",
			"text": bowerPath + "/text/text",
			"firebrick-ui": bowerPath + "/firebrick.ui/dist/firebrick.ui",
			"firebrick-ui-all": bowerPath + "/firebrick.ui/dist/firebrick.ui.all", 
			"doT": bowerPath + "/doT/doT.min",
			"datatables": bowerPath + "/datatables/media/js/jquery.dataTables",
			"jquery-treetable": bowerPath + "/jquery-treetable/jquery.treetable",
			"Firebrick.ui": bowerPath + "/firebrick.ui/dist/components",
			"responsive-images": bowerPath + "/responsive-images/dist/responsiveimages",
			"responsive-tables-js": bowerPath + "/responsive-tables-js/dist/responsivetables",
			"devicejs": bowerPath + "/devicejs/lib/device.min",
			"Firebrick.ui.engines": bowerPath + "/firebrick.ui/dist/engines",
			"bootstrap-datepicker": bowerPath + "/bootstrap-datepicker/dist/bootstrap-datepicker",
			"summernote": bowerPath + "/summernote/dist/summernote.min"
		},
		shim:{
			"knockout-mapping": ["knockout"],
			"bootstrap": ["jquery"],
			"datatables": ["jquery"],
			"responsive-images": ["jquery"],
			"responsive-tables-js": ["jquery"],
			"popover": [ "bootstrap.plugins/tooltip" ],
			"bootstrap.plugins/popover": [ "bootstrap.plugins/tooltip" ],
			"firebrick-ui": [ "firebrick" ],
			"firebrick-ui-all": [ "firebrick-ui" ]
		}
	});	
});