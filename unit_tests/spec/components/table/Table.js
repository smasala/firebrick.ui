/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/table/Table"], function(){
	"use strict";
	
	describe("table.Table:", function(){
		
		var name = "table.table",
			cmp = Firebrick.create("TableTest", {
					extend:"Firebrick.ui.table.Table"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});