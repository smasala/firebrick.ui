/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Divider"], function(){
	"use strict";
	
	describe("display.Divider:", function(){
		
		var name = "fb-ui-divider",
			cmp = Firebrick.create("DividerTest", {
					extend:"Firebrick.ui.display.Divider"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.divider).toBe(name);
		});
		
	});
	
});