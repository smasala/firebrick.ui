/* globals module */
module.exports = function(grunt){
	'use strict';
	
	var tasks = [];

	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	
	
	grunt.initConfig({
		watch: {
		    firebrick: {
		        files: [ "./**/src/*.js"  ],
		        tasks: [ "jscs", "jshint" ]
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
	    jscs: {
	        src: "./src/**/*.js",
	        options: {
	            config: ".jscsrc"
	        }
	    },
	    jshint: {
	    	options: {
	          jshintrc: '.jshintrc',
	          reporter: require('jshint-stylish')
	        },
	        all: {
	          src: [
	            'Gruntfile.js',
	            './src/{,*/}*.js'
	            ]
	        }
        },
		shell: {
			optimiser: {
				command: [ "cd tools",
				           "node fb-all.js",
				            "node r.js -o Firebrick.ui.all.build.src.js",
				            "node r.js -o Firebrick.ui.all.build.dist.js",
				            "cd .."
			            ].join("&&")
			},
			build: {
				command: [
			            "cd dist",
			            "move configuration.js ../__dp_tmp.js",
			            "cd ..",
			            "cd tools",
			            "node r.js -o build.js",
			            "cd ..",
			            "move __dp_tmp.js dist/configuration.js",
			            "yuidoc --configfile yuidoc.json ./src",
			            'copy fbui_small.png "docs/fbui_small.png" /Y' ].join("&&")
			}
		},
	});
	
	tasks = [
             'version', 
             'version:readme',
             'version:comments',
             'shell:optimiser',
             'jscs',
             'jshint',
             'shell:build'
             ];
	
	grunt.registerTask('default', tasks);
};