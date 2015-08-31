"use strict";
var fs = require('fs');

var app = {
	
	//thanks to: http://stackoverflow.com/a/5827895/425226
	walk: function(dir, done) {
		  	var me = this,
	  			results = [];
			  fs.readdir(dir, function(err, list) {
			    if (err) {
			    	return done(err);
			    }
			    var i = 0;
			    (function next() {
			      var file = list[i++];
			      if (!file) {
			    	  return done(null, results);
			      }
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
			file,
			isHtml,
			isJs;
		for(var i = 0, l = fileArray.length; i<l; i++){
			file = fileArray[i];
			isHtml = file.indexOf(".html");
			isJs = file.indexOf(".js");
			//only if it is an html or js file
			if(isHtml !== -1 || isJs !== -1){
				file = file.replace("../src/components/", newPath).replace(".js", "");
				if( file.indexOf(".html") !== -1 ){
					file = "text!" + file;
				}
				fileArray[i] = file;
			}
		}
		return fileArray;
	},
	
	write: function(path, content, callback){
		fs.writeFile(path, content, callback); 
	},
	
	/**
	 * http://stackoverflow.com/a/15778106/425226
	 * @method convertToString
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
					props.push(JSON.stringify(key)+': ' + JSON.stringify(val));
				}
			}
		}
		return ("{ " + props.join(",\n") + " }").replace("{\"", "{ \"").replace("}\"", "} \"");
	},
	
	getConfig: function(env, includePaths){
		var conf = {
				baseUrl: "../src/",
			    out: "../" + env + "/firebrick.ui.all.js",
			    include: ["firebrick", "firebrick-ui"].concat( includePaths ),
			    exclude: ["text"],
			    onBuildWrite: function (moduleName, path, contents) {
			    	if(moduleName === "firebrick-ui"){
			    		contents = contents.replace("define('firebrick-ui',[", "define('firebrick-ui-all',[");
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
	 * @method writeBuild
	 * @param path {String} ".{env}.js" is auto added at the end
	 */
	writeBuild: function(path,  env, includePaths){
		var me = this;
		path = path + "." + env + ".js";
		me.write(path, "(" + me.convertToString( me.getConfig( env, includePaths ) ) + ")", function(err){
			if(err) {
		        return console.log(err);
		    }

		    console.log(env + ": The file was saved!");
		});
	},
	
	readFiles: function(arr, i, l, callback, map){
		var me = this,
			file = arr[i];
		
		if(i < l){
			map = map || {};
			if(file.indexOf(".js") !== -1){
				fs.readFile(file, "utf8", function(err, data){
					var content, className, sName;
					if(err){
						console.info(err);
					}else{
						content = data.toString();
						className = content.match(/return *Firebrick.define *\( *["']+(([a-z0-9\.\_\-]* *))["']+ *, *{/ig) || [];
						sName = content.match(/sName *\: *["']+([a-z0-9\.-_]*)["']+/ig) || [];
						if(className.length === 1 && sName.length === 1){
							className = className[0].match(/["']+([a-z0-9\.-_]*)["']+/ig)[0].replace(/["']/ig, "");
							sName = sName[0].match(/["']+([a-z0-9\.-_]*)["']+/ig)[0].replace(/["']/ig, "");
							map[sName] = className;
						}
					}
					
					me.readFiles(arr, (i+1), l, callback, map);
				});
			}else{
				me.readFiles(arr, (i+1), l, callback, map);
			}
		}else{
			callback(map);
		}
	}
		
};

app.walk("../src/components", function(err, results) {
	var path = "Firebrick.ui.all.build",
		convertedResults;
	if (err){
		throw err;
	}

	app.readFiles(results, 0, results.length, function(map){
		var sourceFile = "../src/firebrick.ui.js";
		fs.readFile(sourceFile, "utf8", function(e,data){
			var content, newContent;
			if(e){
				console.info(e);
			}else{
				content = data.toString();
				newContent = "//{{SNAME.HOLDER}}\n Firebrick.classes.addLookups( " + app.convertToString(map) + " );\n//{{/SNAME.HOLDER}}";
				content = content.replace(/\/\/\{\{SNAME\.HOLDER\}\}(.|[\r\n])*\/\/\{\{\/SNAME\.HOLDER\}\}/g, newContent);
				app.write(sourceFile, content);
				
				convertedResults = app.convertResults( results );
				app.writeBuild(path, "src", convertedResults);
				app.writeBuild(path, "dist", convertedResults);
			}
		});
	});
	
	

	
});