/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/nav/Navbar"], function(){
	"use strict";
	
	describe("nav.Navbar:", function(){
		
		var name = "nav.navbar",
			cmp = Firebrick.create("NavbarTest", {
					extend:"Firebrick.ui.nav.Navbar"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});