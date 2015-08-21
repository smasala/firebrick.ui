/* globals module */
module.exports = function(grunt){
	'use strict';
	
	var tasks = [];

	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	
	
	grunt.initConfig({
		watch: {
		    firebrick: {
		        files: [ "./**/src/*.js"  ],
		        tasks: [ "shell:jscs", "shell:jshint" ]
		    },
	    },
		version: {
	        readme: {
	            options: {
		            prefix: "#Firebrick UI version:\\s*"
	            },
	            src: [ "readme.md" ]
	        },
	        comments: {
	            options: {
		            prefix: "\\* @version\\s*"
	            },
	            src: [ "src/*.js" ]
	        },
	        defaults: {
		        src: [ "src/*.js", "bower.json", "yuidoc.json" ]
	        }
	    },
		shell: {
			jscs: {
		        command: "jscs -c .jscsrc ./src"
	        },
	        jshint: {
	        	 command: "jshint ./src"
	        },
			build: {
				command: [
			            "cd dist",
			            "move configuration.js ../__dp_tmp.js",
			            "cd ..",
			            "cd tools",
			            "node r.js -o build.js",
			            "node fb-all.js",
			            "node r.js -o Firebrick.ui.all.build.src.js",
			            "node r.js -o Firebrick.ui.all.build.dist.js",
			            "cd ..",
			            "move __dp_tmp.js dist/configuration.js",
			            "yuidoc --configfile yuidoc.json ./src",
			            'copy fbui_small.png "docs/fbui_small.png" /Y' ].join('&&')
			}
		},
	});
	
	tasks = [
             'version', 
             'version:readme',
             'version:comments',
             'shell:jscs',
             'shell:jshint',
             'shell:build'
             ];
	
	grunt.registerTask('default', tasks);
};