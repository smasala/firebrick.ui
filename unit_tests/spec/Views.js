/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick-ui"], function($){
	"use strict";
	describe("Views:", function() {
		
		var view = Firebrick.defineView("TestView");
		
		it("passDownEvents", function(){
			expect(view.passDownEvents).toBeDefined();
			expect(view.passDownEvents.rendered).toBe(1);
		});
		
		
		it("listeners", function(){
			expect($.isFunction(view.listeners.uiBuilt)).toBe(true);
		});
		
		it("items property", function(){
			expect(view.items).toBe(null);
		});
		
		it("tpl property", function(){
			expect($.isFunction(view.tpl)).toBe(true);
		});
		
	});	
});
