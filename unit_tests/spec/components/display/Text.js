/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Text"], function(){
	"use strict";
	
	describe("display.Text:", function(){
		
		var name = "display.text",
			cmp = Firebrick.create("TextTest", {
					extend:"Firebrick.ui.display.Text"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});