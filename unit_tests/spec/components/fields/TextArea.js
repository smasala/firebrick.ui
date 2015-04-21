/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/fields/TextArea"], function(){
	"use strict";
	
	describe("Fields.TextArea:", function(){
		
		var name = "fields.textarea",
			cmp = Firebrick.create("TextAreaTest", {
					extend:"Firebrick.ui.fields.TextArea"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.sName).toBe(name);
		});
		
	});
	
});