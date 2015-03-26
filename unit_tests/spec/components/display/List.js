/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/List"], function(){
	"use strict";
	
	describe("display.List:", function(){
		
		var name = "fb-ui-list",
			cmp = Firebrick.create("ListTest", {
					extend:"Firebrick.ui.display.List"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.list).toBe(name);
		});
		
	});
	
});