/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/Password"], function(){
	"use strict";
	
	describe("Fields.Password:", function(){
		
		var name = "fields.password",
			cmp = Firebrick.create("PasswordTest", {
					extend:"Firebrick.ui.fields.Password"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});