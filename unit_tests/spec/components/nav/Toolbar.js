/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/nav/Toolbar"], function(){
	"use strict";
	
	describe("nav.Toolbar:", function(){
		
		var name = "fb-ui-toolbar",
			cmp = Firebrick.create("ToolbarTest", {
					extend:"Firebrick.ui.nav.Toolbar"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.toolbar).toBe(name);
		});
		
	});
	
});