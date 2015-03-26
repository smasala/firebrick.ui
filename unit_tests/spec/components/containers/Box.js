/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/Box"], function(){
	"use strict";
	
	describe("containers.Box:", function(){
		
		var name = "fb-ui-box",
			cmp = Firebrick.create("BoxTest", {
					extend:"Firebrick.ui.containers.Box"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.box).toBe(name);
		});
		
	});
	
});