/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/Email"], function(){
	"use strict";
	
	describe("Fields.Email:", function(){
		
		var name = "fields.email",
			cmp = Firebrick.create("EmailTest", {
					extend:"Firebrick.ui.fields.Email"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});