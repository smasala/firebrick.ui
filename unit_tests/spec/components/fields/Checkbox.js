/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/Checkbox"], function(){
	"use strict";
	
	describe("Fields.Checkbox:", function(){
		
		var name = "fb-ui-checkbox",
			cmp = Firebrick.create("CheckboxTest", {
					extend:"Firebrick.ui.fields.Checkbox"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.checkbox).toBe(name);
		});
		
	});
	
});