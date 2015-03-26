/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/DatePicker"], function(){
	"use strict";
	
	describe("Fields.DatePicker:", function(){
		
		var name = "fb-ui-datepicker",
			cmp = Firebrick.create("DatePickerTest", {
					extend:"Firebrick.ui.fields.DatePicker"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.datepicker).toBe(name);
		});
		
	});
	
});