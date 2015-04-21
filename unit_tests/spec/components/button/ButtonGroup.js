/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/button/ButtonGroup"], function(){
	"use strict";
	
	describe("Button.ButtonGroup:", function(){
		
		var name = "button.buttongroup",
			cmp = Firebrick.create("ButtonGroupTest", {
					extend:"Firebrick.ui.button.ButtonGroup"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});