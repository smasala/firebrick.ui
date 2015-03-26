/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/nav/Navbar"], function(){
	"use strict";
	
	describe("nav.Navbar:", function(){
		
		var name = "fb-ui-navbar",
			cmp = Firebrick.create("NavbarTest", {
					extend:"Firebrick.ui.nav.Navbar"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.navbar).toBe(name);
		});
		
	});
	
});