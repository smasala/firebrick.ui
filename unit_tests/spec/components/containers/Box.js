/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/Box"], function(){
	"use strict";
	
	describe("containers.Box:", function(){
		
		var name = "containers.box",
			cmp = Firebrick.create("BoxTest", {
					extend:"Firebrick.ui.containers.Box"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});