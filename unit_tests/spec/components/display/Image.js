/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Image"], function(){
	"use strict";
	
	describe("display.Image:", function(){
		
		var name = "display.image",
			cmp = Firebrick.create("ImageTest", {
					extend:"Firebrick.ui.display.Image"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});