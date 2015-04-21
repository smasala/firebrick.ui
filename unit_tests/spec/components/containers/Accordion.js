/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/Accordion"], function(){
	"use strict";
	
	describe("containers.Accordion:", function(){
		
		var name = "containers.accordion",
			cmp = Firebrick.create("AccordionTest", {
					extend:"Firebrick.ui.containers.Accordion"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});