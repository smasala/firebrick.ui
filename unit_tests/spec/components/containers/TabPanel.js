/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/TabPanel"], function(){
	"use strict";
	
	describe("containers.TabPanel:", function(){
		
		var name = "fb-ui-tabpanel",
			cmp = Firebrick.create("TabPanelTest", {
					extend:"Firebrick.ui.containers.TabPanel"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.tabpanel).toBe(name);
		});
		
	});
	
});