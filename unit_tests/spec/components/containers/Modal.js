/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/Modal"], function(){
	"use strict";
	
	describe("containers.Modal:", function(){
		
		var name = "fb-ui-modal",
			cmp = Firebrick.create("ModalTest", {
					extend:"Firebrick.ui.containers.Modal",
					autoRender:false,
					showOnCreate:false
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.modal).toBe(name);
		});
		
	});
	
});