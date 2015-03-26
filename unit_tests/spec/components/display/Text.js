/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Text"], function(){
	"use strict";
	
	describe("display.Text:", function(){
		
		var name = "fb-ui-text",
			cmp = Firebrick.create("TextTest", {
					extend:"Firebrick.ui.display.Text"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.text).toBe(name);
		});
		
	});
	
});