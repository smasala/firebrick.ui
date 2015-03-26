/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/Panel"], function(){
	"use strict";
	
	describe("containers.Panel:", function(){
		
		var name = "fb-ui-panel",
			cmp = Firebrick.create("PanelTest", {
					extend:"Firebrick.ui.containers.Panel"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.panel).toBe(name);
		});
		
	});
	
});