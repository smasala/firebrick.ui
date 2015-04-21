/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/DatePicker"], function(){
	"use strict";
	
	describe("Fields.DatePicker:", function(){
		
		var name = "fields.datepicker",
			cmp = Firebrick.create("DatePickerTest", {
					extend:"Firebrick.ui.fields.DatePicker"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});