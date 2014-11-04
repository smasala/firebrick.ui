#Firebrick UI v0.2.0 Stable

UI extendable component library for Firebrick MVC, built with :

* Firebrick MVC
* jQuery
* Bootstrap
* Knockout JS
* Require JS

## Install with Bower
```
bower install "firebrick.ui"
```
<!--
##Demo

Checkout the [Dashboard ](http://demo.firebrickjs.com) demo
-->
##Usage

###Require JS

* HEAD
```
	<!-- Application -->
	<script data-main="app/main" src="bower_components/requirejs/require.js"></script>
	
	<!-- Bootstrap -->
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css" />
	
	<!-- Datatables -->
	<link rel="stylesheet" href="bower_components/datatables/media/css/jquery.dataTables.css" />

	<!-- TreeTables -->
	<link rel="stylesheet" href="bower_components/jquery-treetable/css/jquery.treetable.css" />
	
	<!-- X-Editable -->
	<link href="bower_components/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">
	
	<!-- Firebrick -->
	<link rel="stylesheet" href="bower_components/firebrick/dist/firebrick.css" />
	<!-- Firebrick UI -->
	<link rel="stylesheet" href="bower_components/firebrick.ui/dist/firebrick.ui.css" />
```

* Create you application

```
require.config({
	paths:{
		"dependencies": "../bower_components/firebrick.ui/src/dependencies"
	}
});

require(["dependencies"], function(){
	
	require(["jquery", "firebrick", "firebrick-ui", "bootstrap"], function(){
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
});
```
