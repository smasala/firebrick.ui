/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/button/Icon"], function(){
	"use strict";
	
	describe("Button.Icon:", function(){
		
		var name = "button.icon",
			cmp = Firebrick.create("IconTest", {
					extend:"Firebrick.ui.button.Icon"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});