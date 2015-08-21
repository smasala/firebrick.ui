/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * built on the back of: http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
 *
 * @module plugins
 * @namespace plugins
 * @class Draggable
 */
define( [ "jquery" ], function( $ ) {
	"use strict";

	/**
	 * @method drags
	 * @event dragged - fired on mouseup
	 * set property "dragDisabled" on element to disable dragging at anytime
	 * @example
	 * 		jqueryEl.prop("dragDisabled", {true|false});
	 * @example
	 * 		jqueryEl.drags("vertical");
	 * 		jqueryEl.drags("horizontal");
	 */
	$.fn.drags = function( direction, opt ) {
		var $el, origPageX, origPageY, top, left, correctPageCoord = function( event, axis ) {
			axis = axis.toUpperCase();

			//get the correct page(X|Y) coord depending on whether it is a touch device
			if ( event.type.indexOf( "touch" ) >= 0 ) {
				return event.originalEvent.targetTouches[ 0 ][ "page" + axis ];
			} else {
				return event[ "page" + axis ];
			}

		};

		direction = direction.toLowerCase();
		opt = $.extend( {
			handle: ""
		}, opt );

		if ( opt.handle === "" ) {
			$el = this;
		} else {
			$el = this.find( opt.handle );
		}

		if ( $el.prop( "dragSet" ) === true ) {
			return $el;
		}

		//set a prop on the element to ensure that the event aren't registered more than once
		$el.prop( "dragSet", true );

		return $el.on( "mouseover", function() {
			var $drag = $( this );
			if ( $drag.prop( "dragDisabled" ) === true ) {
				$drag.css( "cursor", "auto" );
			} else {
				$drag.css( "cursor", "" );
			}
		} ).on( "mousedown touchstart", function( e ) {
			var $drag = !opt.handle ? $( this ).addClass( "draggable" ) : $( this ).addClass( "active-handle" ).parent().addClass( "draggable" ), zIdx = $drag.css( "z-index" ), drgH = $drag.outerHeight(), drgW = $drag.outerWidth(), posY = $drag.offset().top + drgH - correctPageCoord( e, "y" ), posX = $drag.offset().left + drgW - correctPageCoord( e, "x" ), mouseMove;

			origPageY = correctPageCoord( e, "y" );
			origPageX = correctPageCoord( e, "x" );

			mouseMove = function( e ) {
				top = ( direction === "horizontal" ? origPageY : correctPageCoord( e, "y" ) ) + posY - drgH;
				left = ( direction === "vertical" ? origPageX : correctPageCoord( e, "x" ) ) + posX - drgW;
				$drag.offset( {
				    top: top,
				    left: left
				} );
			};

			$drag.on( "mouseup touchend", function() {
				$drag.removeClass( "draggable" ).css( "z-index", zIdx );
				//remove handler
				$( "html" ).off( "mousemove touchmove", "body", mouseMove );
			} );

			if ( $drag.prop( "dragDisabled" ) === true ) {
				$( "html" ).off( "mousemove touchmove", "body", mouseMove );
			} else {
				$drag.css( "z-index", 1000 );
				//add handler
				$( "html" ).on( "mousemove touchmove", "body", mouseMove );
			}

			e.preventDefault(); // disable selection

		} ).on( "mouseup touchend", function() {
			var $this = $( this );
			if ( $this.prop( "dragDisabled" ) !== true ) {
				if ( opt.handle === "" ) {
					$this.removeClass( "draggable" );
				} else {
					$this.removeClass( "active-handle" ).parent().removeClass( "draggable" );
				}
				$this.trigger( "dragged", [ top - origPageY, left - origPageX ] );
				$this.css( {
				    top: 0,
				    left: 0
				} );
			}
		} );

	};

} );
