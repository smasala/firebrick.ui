/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/table/TreeTable"], function(){
	"use strict";
	
	describe("table.TreeTable:", function(){
		
		var name = "table.treetable",
			cmp = Firebrick.create("TreeTableTest", {
					extend:"Firebrick.ui.table.TreeTable"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});