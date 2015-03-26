/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["firebrick-ui", "Firebrick.ui/display/Span"], function(){
	"use strict";
	
	describe("display.Span:", function(){
		
		var name = "fb-ui-span",
			cmp = Firebrick.create("SpanTest", {
					extend:"Firebrick.ui.display.Span"
			});
		
		it("Defined", function(){
			expect(cmp).toBeDefined();
			expect(cmp.uiName).toBe(name);
			expect(fb.ui.cmp.span).toBe(name);
		});
		
	});
	
});