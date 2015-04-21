/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/GridRow"], function(){
	"use strict";
	
	describe("containers.GridRow:", function(){
		
		var name = "containers.gridrow",
			cmp = Firebrick.create("GridRowTest", {
					extend:"Firebrick.ui.containers.GridRow"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});