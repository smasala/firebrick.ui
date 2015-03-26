/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/containers/GridRow"], function(){
	"use strict";
	
	describe("containers.GridRow:", function(){
		
		var name = "fb-ui-gridrow",
			cmp = Firebrick.create("GridRowTest", {
					extend:"Firebrick.ui.containers.GridRow"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.gridrow).toBe(name);
		});
		
	});
	
});