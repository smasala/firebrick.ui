/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/nav/Breadcrumbs"], function(){
	"use strict";
	
	describe("nav.BreadCrumbs:", function(){
		
		var name = "nav.breadcrumbs",
			cmp = Firebrick.create("BreadcrumbsTest", {
					extend:"Firebrick.ui.nav.Breadcrumbs"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});