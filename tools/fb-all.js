"use strict";
var fs = require('fs');

var app = {
	
	//thanks to: http://stackoverflow.com/a/5827895/425226
	walk: function(dir, done) {
		  	var me = this,
	  			results = [];
			  fs.readdir(dir, function(err, list) {
			    if (err) return done(err);
			    var i = 0;
			    (function next() {
			      var file = list[i++];
			      if (!file) return done(null, results);
			      file = dir + '/' + file;
			      fs.stat(file, function(err, stat) {
			        if (stat && stat.isDirectory()) {
			          me.walk(file, function(err, res) {
			            results = results.concat(res);
			            next();
			          });
			        } else {
			          results.push(file);
			          next();
			        }
			      });
			    })();
			  });
	},
	convertResults: function( fileArray ){
		var newPath = "Firebrick.ui/",
			file;
		for(var i = 0, l = fileArray.length; i<l; i++){
			file = fileArray[i];
			file = file.replace("../src/components/", newPath).replace(".js", "");
			if( file.indexOf(".html") !== -1 ){
				file = "text!" + file;
			}
			fileArray[i] = file;
		}
		return fileArray;
	},
	
	write: function(path, content, callback){
		fs.writeFile(path, content, callback); 
	},
	
	/**
	 * http://stackoverflow.com/a/15778106/425226
	 */
	convertToString: function(obj){
		var props = [],
			val;
		for(var key in obj){
			if( obj.hasOwnProperty(key) ){
				val = obj[key];
				if(typeof val === "function"){
					props.push(JSON.stringify(key)+': ' + val.toString());	
				}else{
					props.push(JSON.stringify(key)+': ' + JSON.stringify(val))
				}
			}
		}
		return "({" + props.join(",\n") + "})";
	},
	
	getConfig: function(env, includePaths){
		var me = this,
			conf = {
				baseUrl: "../src/",
			    out: "../" + env + "/firebrick.ui.all.js",
			    include: ["firebrick", "firebrick-ui"].concat( includePaths ),
			    exclude: ["text"],
			    onBuildWrite: function (moduleName, path, contents) {
			    	if(moduleName === "firebrick-ui"){
			    		contents = contents.replace("define('firebrick-ui',[", "define('firebrick-ui-all',[");
			        	console.info("---->", contents.substr(0, 500))
			        }
			        return contents;
			    },
			    paths:{
					"jquery": "empty:",
					"knockout": "empty:",
					"knockout-mapping": "empty:",
					"firebrick": "empty:",
					"bootstrap": "empty:",
					"bootstrap.plugins": "empty:",
					"text": "../tools/bower_components/text/text",
					"firebrick-ui": "../src/firebrick.ui",
					"doT": "empty:",
					"datatables": "empty:",
					"jquery-treetable": "empty:",
					"Firebrick.ui": "../src/components",
					"responsive-images": "empty:",
					"responsive-tables-js": "empty:",
					"devicejs": "empty:e",
					"Firebrick.ui.engines": "../src/engines",
					"bootstrap-datepicker": "empty:",
					"summernote": "empty:"
				}	
			};
		
		if(env === "src"){
			//turn minify off
			conf.optimize = "none";
		}
		
		return conf;
	},
	
	/**
	 * @param path {String} ".{env}.js" is auto added at the end
	 */
	writeBuild: function(path,  env, includePaths){
		var me = this;
		path = path + "." + env + ".js";
		me.write(path, me.convertToString( me.getConfig( env, includePaths ) ), function(err){
			if(err) {
		        return console.log(err);
		    }

		    console.log(env + ": The file was saved!");
		});
	}
		
};

app.walk("../src/components", function(err, results) {
	var path = "Firebrick.ui.all.build";
	if (err){
		throw err;
	}
	
	results = app.convertResults( results );
	
	app.writeBuild(path, "src", results);
	app.writeBuild(path, "dist", results);
	
});