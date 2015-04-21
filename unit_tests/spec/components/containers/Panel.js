/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/Panel"], function(){
	"use strict";
	
	describe("containers.Panel:", function(){
		
		var name = "containers.panel",
			cmp = Firebrick.create("PanelTest", {
					extend:"Firebrick.ui.containers.Panel"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});