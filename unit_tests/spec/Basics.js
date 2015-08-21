/*!
 * Firebrick JS - Unit Tests
 * @author Steven Masala [me@smasala.com]
 */
define( [ "jquery", "firebrick-ui" ], function() {
	"use strict";
	describe( "Basics:", function() {

		it( "Version", function() {
			expect( typeof Firebrick.ui.version ).toBe( "string" );
		} );

	} );
} );
