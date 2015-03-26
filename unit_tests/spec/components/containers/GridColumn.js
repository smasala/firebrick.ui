/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/GridColumn"], function(){
	"use strict";
	
	describe("containers.GridColumn:", function(){
		
		var name = "fb-ui-gridcol",
			cmp = Firebrick.create("GridColumnTest", {
					extend:"Firebrick.ui.containers.GridColumn"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.gridcol).toBe(name);
		});
		
	});
	
});