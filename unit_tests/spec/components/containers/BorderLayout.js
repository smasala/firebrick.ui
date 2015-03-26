/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/BorderLayout"], function(){
	"use strict";
	
	describe("containers.BorderLayout:", function(){
		
		var name = "fb-ui-borderlayout",
			cmp = Firebrick.create("BorderLayoutTest", {
					extend:"Firebrick.ui.containers.BorderLayout"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.borderlayout).toBe(name);
		});
		
	});
	
});