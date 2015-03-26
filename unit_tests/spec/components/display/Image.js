/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Image"], function(){
	"use strict";
	
	describe("display.Image:", function(){
		
		var name = "fb-ui-image",
			cmp = Firebrick.create("ImageTest", {
					extend:"Firebrick.ui.display.Image"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.image).toBe(name);
		});
		
	});
	
});