var ad = 300;
var ae = 'cubic-bezier(.65,0,.25,1.3)';

$(document).ready(function(){

    /*
    * /Display document only when LESS finished compiling CSS
    */
    less.pageLoadFinished.then(
        function() {
            // code to run after less has finished
            setTimeout( function() {
                $('html').show();
            }, 300);
        }
    )

    // Uses document because document will be topmost level in bubbling
    // Disable overscroll / viewport moving on everything but scrollable divs
    $(document).on('touchmove', function (e) {
        if (!$('.scrollable').has($(e.target)).length) e.preventDefault();
    });

    // Add extra top padding in case of stand alone app
    if (window.navigator.standalone == true) $('body').css( { 'margin-top': '30px', 'height': 'calc(100% - 40px)' } );

    //Start FastClick to prevent 300ms delay on taps.
    $(function() {
        FastClick.attach(document.body);
    });
 });

// UUID generator
function uuidgen() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//jQuery related code to properly handle scrollStop event in iOS Safari
(function( $ ) {
    $.fn.stopScroll = function( options ) {
        options = $.extend({
            delay: 250,
            callback: function() {}
        }, options);

        return this.each(function() {
            var $element = $( this ),
                element = this;
            $element.scroll(function() {
                clearTimeout( $.data( element, "scrollCheck" ) );
                $.data( element, "scrollCheck", setTimeout(function() {
                    options.callback();
                }, options.delay ) );
            });
        });
    };

})( jQuery );
