/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/Input"], function(){
	"use strict";
	
	describe("Fields.Input:", function(){
		
		var name = "fb-ui-input",
			cmp = Firebrick.create("InputTest", {
					extend:"Firebrick.ui.fields.Input"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.input).toBe(name);
		});
		
	});
	
});