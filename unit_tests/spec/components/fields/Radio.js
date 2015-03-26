/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/Radio"], function(){
	"use strict";
	
	describe("Fields.Radio:", function(){
		
		var name = "fb-ui-radio",
			cmp = Firebrick.create("RadioTest", {
					extend:"Firebrick.ui.fields.Radio"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.radio).toBe(name);
		});
		
	});
	
});