/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/Form"], function(){
	"use strict";
	
	describe("containers.Form:", function(){
		
		var name = "fb-ui-form",
			cmp = Firebrick.create("FormTest", {
					extend:"Firebrick.ui.containers.Form"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.form).toBe(name);
		});
		
	});
	
});