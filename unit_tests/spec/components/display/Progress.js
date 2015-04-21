/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Progress"], function(){
	"use strict";
	
	describe("display.Progress:", function(){
		
		var name = "display.progress",
			cmp = Firebrick.create("ProgressTest", {
					extend:"Firebrick.ui.display.Progress"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});