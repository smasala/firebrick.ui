/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/Modal"], function(){
	"use strict";
	
	describe("containers.Modal:", function(){
		
		var name = "containers.modal",
			cmp = Firebrick.create("ModalTest", {
					extend:"Firebrick.ui.containers.Modal",
					autoRender:false,
					showOnCreate:false
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});