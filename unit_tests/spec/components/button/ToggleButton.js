/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/button/ToggleButton"], function(){
	"use strict";
	
	describe("Button.ToggleButton:", function(){
		
		var name = "button.togglebutton",
			cmp = Firebrick.create("ToggleButtonTest", {
					extend:"Firebrick.ui.button.ToggleButton"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});