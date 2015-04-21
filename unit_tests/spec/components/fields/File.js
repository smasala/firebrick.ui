/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/File"], function(){
	"use strict";
	
	describe("Fields.File:", function(){
		
		var name = "fields.file",
			cmp = Firebrick.create("FileTest", {
					extend:"Firebrick.ui.fields.File"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});