/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/button/Button"], function(){
	"use strict";
	
	describe("Button.Button:", function(){
		
		var name = "button.button",
			cmp = Firebrick.create("ButtonTest", {
					extend:"Firebrick.ui.button.Button"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});