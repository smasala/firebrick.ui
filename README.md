#Firebrick UI version: 0.14.5

UI extendable component library built for:

* [Firebrick MVC](https://github.com/smasala/firebrick)
    * jQuery 2
    * Bootstrap 3
    * Knockout JS 3
    * Require JS 2

## Install with Bower
```
bower install "firebrick.ui"
```

##Demo

Checkout the [Component ] (http://demo-ui.firebrickjs.com) demo

##Usage

###Require JS

* HEAD
```
	<!-- Bootstrap -->
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css" />
	
	<!-- Datatables -->
	<link rel="stylesheet" href="bower_components/datatables/media/css/jquery.dataTables.css" />

	<!-- TreeTables -->
	<link rel="stylesheet" href="bower_components/jquery-treetable/css/jquery.treetable.css" />
	
	<!-- Responsive Tables -->
	<link rel="stylesheet" href="bower_components/responsive-tables-js/dist/responsivetables.css" />
	
	<!-- X-Editable -->
	<link href="bower_components/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">
	
	<!-- Firebrick -->
	<link rel="stylesheet" href="bower_components/firebrick/dist/firebrick.css" />
	
	<!-- Firebrick UI -->
	<link rel="stylesheet" href="bower_components/firebrick.ui/dist/firebrick.ui.css" />
	
	<!-- Application -->
	<script data-main="app/main" src="bower_components/requirejs/require.js"></script>
```

* Create you application

```
require.config({
	paths:{
		"configuration": "../bower_components/firebrick.ui/dist/configuration"
	}
});

require(["configuration"], function(){
	
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
