/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/nav/Pagination"], function(){
	"use strict";
	
	describe("nav.Pagination:", function(){
		
		var name = "fb-ui-pagination",
			cmp = Firebrick.create("PaginationTest", {
					extend:"Firebrick.ui.nav.Pagination"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.pagination).toBe(name);
		});
		
	});
	
});