/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Progress"], function(){
	"use strict";
	
	describe("display.Progress:", function(){
		
		var name = "fb-ui-progress",
			cmp = Firebrick.create("ProgressTest", {
					extend:"Firebrick.ui.display.Progress"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.progress).toBe(name);
		});
		
	});
	
});