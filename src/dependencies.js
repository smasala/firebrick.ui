/*!
 * Author: Steven Masala
 * Firebrick UI Dependency Confirugation
 */
define(function(){
	return require.config({
		paths:{
			"jquery": "../bower_components/jquery/dist/jquery",
			"knockout": "../bower_components/knockoutjs/dist/knockout",
			"knockout-mapping": "../bower_components/knockout-mapping/knockout.mapping",
			"firebrick": "../bower_components/firebrick/dist/firebrick",
			"bootstrap": "../bower_components/bootstrap/dist/js/bootstrap.min",
			"text": "../bower_components/text/text",
			"firebrick-ui": "../bower_components/firebrick.ui/src/firebrick.ui",
			"handlebars": "../bower_components/handlebars/handlebars",
			"datatables": "../bower_components/datatables/media/js/jquery.dataTables",
			"jquery-treetable": "../bower_components/jquery-treetable/jquery.treetable",
			"x-editable": "../bower_components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable",
			"fb-ui-plugins": "../bower_components/firebrick-ui/plugins",
			"knockout-x-editable": "../bower_components/knockout-x-editable/knockout.x-editable",
			"Firebrick.ui": "../bower_components/firebrick.ui/src/components"
		},
		shim:{
			"knockout-mapping": ["knockout"],
			"bootstrap": ["jquery"],
			"datatables": ["jquery"],
			"x-editable": ["bootstrap"]
		}
	});	
});