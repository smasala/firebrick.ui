#Firebrick UI v0.1.4 Stable

UI extendable component library for Firebrick MVC, built with :

* Firebrick MVC
* jQuery
* Bootstrap
* Knockout JS
* Require JS

## Install with Bower
```
bower install firebrick.ui
```
<!--
##Demo

Checkout the [Dashboard ](http://demo.firebrickjs.com) demo
-->
##Usage

###Require JS

* CSS
```
	<!-- Bootstrap -->
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css" />
	
	<!-- Datatables -->
	<link rel="stylesheet" href="bower_components/datatables/media/css/jquery.dataTables.css" />
	
	<!-- TreeTables -->
	<link rel="stylesheet" href="bower_components/jquery-treetable/css/jquery.treetable.css" />
	<link rel="stylesheet" href="bower_components/firebrick-ui/firebrick-ui.css" />
	
	<!-- X-Editable -->
	<link href="bower_components/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">
	
	<!-- Firebrick JS -->
	<link rel="stylesheet" href="bower_components/firebrick/firebrick.css" />
	
	<!-- Firebrick UI -->
	<link rel="stylesheet" href="bower_components/firebrick.ui/firebrick.ui.css" />
	
	<!-- Require JS and App Start -->
	<script data-main="js/app" src="bower_components/requirejs/require.js"></script>
```

* Create you application

```
	require.config({
		paths:{
			"jquery": "../bower_components/jquery/dist/jquery",
			"knockout": "../bower_components/knockoutjs/dist/knockout",
			"knockout-mapping": "../bower_components/knockout-mapping/knockout.mapping",
			"firebrick": "../bower_components/firebrick/firebrick",
			"bootstrap": "../bower_components/bootstrap/dist/js/bootstrap.min",
			"text": "../bower_components/text/text",
			"firebrick-ui": "../bower_components/firebrick-ui/firebrick.ui",
			"Firebrick.ui": "../bower_components/firebrick-ui/components",
			"handlebars": "../bower_components/handlebars/handlebars",
			"datatables": "../bower_components/datatables/media/js/jquery.dataTables",
			"jquery-treetable": "../bower_components/jquery-treetable/jquery.treetable",
			"x-editable": "../bower_components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable",
			"knockout-x-editable": "../bower_components/knockout-x-editable/knockout.x-editable",
		},
		shim:{
			"knockout-mapping": ["knockout"],
			"bootstrap": ["jquery"],
			"datatables": ["jquery"],
			"x-editable": ["bootstrap"]
		}
	});

    require(["firebrick"], function(){
		Firebrick.ready({
			app:{
				name:"MyApp",
				path:"js/"
			},
			go:function(){
				//Do your thing
			}
		});
    });

```
