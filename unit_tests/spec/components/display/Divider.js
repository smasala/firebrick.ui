/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Divider"], function(){
	"use strict";
	
	describe("display.Divider:", function(){
		
		var name = "display.divider",
			cmp = Firebrick.create("DividerTest", {
					extend:"Firebrick.ui.display.Divider"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});