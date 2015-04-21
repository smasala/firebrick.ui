/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/nav/Pagination"], function(){
	"use strict";
	
	describe("nav.Pagination:", function(){
		
		var name = "nav.pagination",
			cmp = Firebrick.create("PaginationTest", {
					extend:"Firebrick.ui.nav.Pagination"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});