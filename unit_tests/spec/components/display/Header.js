/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Header"], function(){
	"use strict";
	
	describe("display.Header:", function(){
		
		var name = "display.header",
			cmp = Firebrick.create("HeaderTest", {
					extend:"Firebrick.ui.display.Header"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});