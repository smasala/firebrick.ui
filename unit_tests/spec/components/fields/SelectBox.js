/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/SelectBox"], function(){
	"use strict";
	
	describe("Fields.SelectBox:", function(){
		
		var name = "fields.selectbox",
			cmp = Firebrick.create("SelectBoxTest", {
					extend:"Firebrick.ui.fields.SelectBox"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});