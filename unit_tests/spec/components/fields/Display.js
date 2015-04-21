/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/Display"], function(){
	"use strict";
	
	describe("Fields.Display:", function(){
		
		var name = "fields.display",
			cmp = Firebrick.create("DisplayTest", {
					extend:"Firebrick.ui.fields.Display"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});