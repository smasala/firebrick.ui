/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/GridColumn"], function(){
	"use strict";
	
	describe("containers.GridColumn:", function(){
		
		var name = "containers.gridcolumn",
			cmp = Firebrick.create("GridColumnTest", {
					extend:"Firebrick.ui.containers.GridColumn"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});