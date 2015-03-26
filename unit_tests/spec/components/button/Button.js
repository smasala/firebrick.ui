/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/button/Button"], function(){
	"use strict";
	
	describe("Button.Button:", function(){
		
		var name = "fb-ui-button",
			cmp = Firebrick.create("ButtonTest", {
					extend:"Firebrick.ui.button.Button"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.button).toBe(name);
		});
		
	});
	
});