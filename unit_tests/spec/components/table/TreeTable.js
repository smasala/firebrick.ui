/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/table/TreeTable"], function(){
	"use strict";
	
	describe("table.TreeTable:", function(){
		
		var name = "fb-ui-treetable",
			cmp = Firebrick.create("TreeTableTest", {
					extend:"Firebrick.ui.table.TreeTable"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.treetable).toBe(name);
		});
		
	});
	
});