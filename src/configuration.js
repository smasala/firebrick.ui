/*!
 * Firebrick UI Dependency Configuration
 * @author Steven Masala [me@smasala.com]
**/

define(function(){
	"use strict";
	return require.config({
		paths:{
			"jquery": "../bower_components/jquery/dist/jquery",
			"knockout": "../bower_components/knockoutjs/dist/knockout",
			"knockout-mapping": "../bower_components/knockout-mapping/knockout.mapping",
			"firebrick": "../bower_components/firebrick/src/firebrick",
			"bootstrap": "../bower_components/bootstrap/dist/js/bootstrap.min",
			"bootstrap.plugins": "../bower_components/bootstrap/js",
			"text": "../bower_components/text/text",
			"firebrick-ui": "../bower_components/firebrick.ui/src/firebrick.ui",
			"doT": "../bower_components/doT/doT",
			"datatables": "../bower_components/datatables/media/js/jquery.dataTables",
			"jquery-treetable": "../bower_components/jquery-treetable/jquery.treetable",
			"x-editable": "../bower_components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable",
			"knockout-x-editable": "../bower_components/knockout-x-editable/knockout.x-editable",
			"Firebrick.ui": "../bower_components/firebrick.ui/src/components",
			"responsive-images": "../bower_components/responsive-images/src/responsiveimages",
			"responsive-tables-js": "../bower_components/responsive-tables-js/src/responsivetables" 
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