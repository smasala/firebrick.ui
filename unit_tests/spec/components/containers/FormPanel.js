/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/FormPanel"], function(){
	"use strict";
	
	describe("containers.FormPanel:", function(){
		
		var name = "fb-ui-formpanel",
			cmp = Firebrick.create("FormPanelTest", {
					extend:"Firebrick.ui.containers.FormPanel"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.formpanel).toBe(name);
		});
		
	});
	
});