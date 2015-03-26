/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/File"], function(){
	"use strict";
	
	describe("Fields.File:", function(){
		
		var name = "fb-ui-file",
			cmp = Firebrick.create("FileTest", {
					extend:"Firebrick.ui.fields.File"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.file).toBe(name);
		});
		
	});
	
});