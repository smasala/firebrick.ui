/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/Display"], function(){
	"use strict";
	
	describe("Fields.Display:", function(){
		
		var name = "fb-ui-display",
			cmp = Firebrick.create("DisplayTest", {
					extend:"Firebrick.ui.fields.Display"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.display).toBe(name);
		});
		
	});
	
});