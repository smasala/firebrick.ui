/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Alert"], function(){
	"use strict";
	
	describe("display.Alert:", function(){
		
		var name = "display.alert",
			cmp = Firebrick.create("AlertTest", {
					extend:"Firebrick.ui.display.Alert"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});