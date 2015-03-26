/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick-ui", "Firebrick.ui/nav/List"], function($){
	"use strict";
	
	describe("nav.List:", function(){
		
		
		var name = "fb-ui-navlist",
			cmp = Firebrick.create("NavListTest", {
					extend:"Firebrick.ui.nav.List"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.navlist).toBe(name);
		});
		
	});
	
});