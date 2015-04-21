/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/List"], function(){
	"use strict";
	
	describe("display.List:", function(){
		
		var name = "display.list",
			cmp = Firebrick.create("ListTest", {
					extend:"Firebrick.ui.display.List"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});