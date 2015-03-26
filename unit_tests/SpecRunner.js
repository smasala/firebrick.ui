/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
/**
Called by SpecRunner.html
**/
require.config({
	baseUrl: "",
	//urlArgs: 'cb=' + Math.random(),
	paths: {
		"configuration": "../src/configuration",
		"bower_components": "bower_components",
		"Test": "helpers",
		"spec": 'spec'
	}
});

require(["configuration"], function(){
	"use strict";
	
	require(['jquery', 'spec/Index', "firebrick", "firebrick-ui", "bootstrap"], function($, index, Firebrick) {
		var jasmineEnv = jasmine.getEnv();
		
		Firebrick.app.name = "Test";
		
		$(function() {
			require(index.specs, function() {
				jasmineEnv.execute();
		    });
		});
		
	});
	
});

