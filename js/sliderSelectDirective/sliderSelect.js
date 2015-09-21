app.directive('sliderSelect', ['$timeout', function($timeout) {
  	return {
    	restrict: 'E',
		require: '?ngModel',
    	scope: {
      		listElements: '=',
      		listTemplate: '@',
      		listClass: '@',
    	},
    	templateUrl: 'js/sliderSelectDirective/sliderSelect.html',
    	link: 
    		function( scope, element, attrs, ctrl ) {
    			scope.elementsReady = true;

		    	scope.controlBody = $( ".select-slider", element );

				//Listen to ngModel value change
				ctrl.$formatters.push( function() {
					scope.setActiveElement( ctrl.$modelValue );
				} );

				//Listen to ng-show value change
				scope.$watch( function() { return element.is(':visible') }, function() {
		    		scope.setActiveElement( ctrl.$modelValue );
				} );

				//Setting active element (scroll to active)
				scope.setActiveElement = function ( index ) {

					if ( index < 0 ) { index = 0 }
					if ( index > scope.listElements.length - 1) { index = scope.listElements.length - 1 }

					scope.activeElement = index;
					$timeout(function(){
						ctrl.$setViewValue( index );
					} );
				}

				scope.setActiveElementAnimate = function( index ){
					if ( index < 0 ) { 
						$( '.active', scope.controlBody ).transition( { translate : [ '20px', '0' ], opacity : .5, duration : ad / 4, easing : ae}, function() {
							$( '.active', scope.controlBody ).transition( { translate : [ '0px', '0' ], opacity : 1, duration : ad / 4, easing : ae})
						});
						return;
					}
					if ( index > scope.listElements.length - 1 ) {
						$( '.active', scope.controlBody ).transition( { translate : [ '-20px', '0' ], opacity: .5, duration : ad / 4, easing : ae }, function() {
							$( '.active', scope.controlBody ).transition( { translate : [ '0px', '0' ], opacity: 1 ,duration : ad / 4, easing : ae } )
						} );
						return;
					}

					if (index > scope.activeElement ) {
						$('.active', scope.controlBody).transition({ translate: ['-40px', '0'], opacity: 0, duration: ad/4, easing: ae}, function(){
							$('.active', scope.controlBody).transition({ translate: ['40px', '0'], duration:0 }, function() {
								scope.setActiveElement( index );
								scope.$apply();
								$('.stripe', scope.controlBody).animate( { 'background-position-x' : '-=' + 45 + 'px' } );
								$('.active', scope.controlBody).transition({ translate: ['0px', '0'], opacity: 1, duration: ad/4, easing: ae });
							});
						});
					} else {
					$( '.active', scope.controlBody ).transition( { translate: [ '40px', '0' ], opacity: 0, duration: ad / 4, easing: ae}, function() {
							$('.active', scope.controlBody).transition({ translate: ['-40px', '0'], duration:0 }, function() {
								scope.setActiveElement( index );
								scope.$apply();
								$('.stripe', scope.controlBody).animate( { 'background-position-x' : '+=' + 45 + 'px' } );								
								$('.active', scope.controlBody).transition({ translate: [ '0px', '0' ], opacity: 1, duration: ad / 4, easing: ae } );
							});
						});
					}
				}
				
				scope.setActiveElement( 0 );

				scope.listElementTemplate = function( element ) {
					if (!scope.listTemplate) {
						return element;
					} else {
						return eval( scope.listTemplate );
					}
				}				

				touchStarted = false;
				xTouchPosPreEnd = 0;

				var pointerEventToXY = function( e ){
			      var out = { x : 0, y : 0 };
			        out.x = e.pageX || e.originalEvent.touches[ 0 ].pageX;
			        out.y = e.pageY || e.originalEvent.touches[ 0 ].pageY;
			      return out;
			    };

				$( scope.controlBody ).on( 'mousedown touchstart', function( e ) {
					touchStarted = true;
					xTouchPosStart  = pointerEventToXY(e).x;
				});
				
				$( scope.controlBody ).on( 'mouseup touchend mouseleave', function( e ) {
					touchStarted = false;
				});

				$( scope.controlBody ).on( 'mousemove touchmove', function( e ) {
					if ( touchStarted ) {

						scope.$apply();
						xTouchPosEnd = pointerEventToXY(e).x;
						xTouchPosDelta = xTouchPosEnd - xTouchPosStart;
						xTouchPosDeltaSign = Math.abs(xTouchPosDelta) / xTouchPosDelta;

						if ( scope.activeElement != 0 && scope.activeElement != scope.listElements.length -1 ) {
							$( '.stripe', scope.controlBody ).css( 'background-position' , xTouchPosEnd+'px 0px' );
						}
						
						if ( Math.abs( xTouchPosDelta ) > 20 ) {
							scope.setActiveElement ( scope.activeElement -= xTouchPosDelta / Math.abs( xTouchPosDelta ) );
							xTouchPosStart = pointerEventToXY( e ).x;
						}
					}
				});
	   		},
	  	}
	}])