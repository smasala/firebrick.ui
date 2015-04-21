/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/nav/List"], function(){
	"use strict";
	
	describe("nav.List:", function(){
		
		
		var name = "nav.list",
			cmp = Firebrick.create("NavListTest", {
					extend:"Firebrick.ui.nav.List"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});