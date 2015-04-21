/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/TabPanel"], function(){
	"use strict";
	
	describe("containers.TabPanel:", function(){
		
		var name = "containers.tabpanel",
			cmp = Firebrick.create("TabPanelTest", {
					extend:"Firebrick.ui.containers.TabPanel"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});