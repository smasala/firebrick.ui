/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/BorderLayout"], function(){
	"use strict";
	
	describe("containers.BorderLayout:", function(){
		
		var name = "containers.borderlayout",
			cmp = Firebrick.create("BorderLayoutTest", {
					extend:"Firebrick.ui.containers.BorderLayout"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});