var options = {
    sequence : true,
    duration : 500,
    sequenceDuration : 300,
    sequenceInterval : 100,
    //timingFunction : "cubic-bezier(.7,0,.3,1.5)",
}

//var modifications = ;
less.pageLoadFinished.then(
    function() {
        // less.modifyVars ( {
        //     '@av-animation-duration' : options.duration / 1000 + 's',
        //     '@av-animation-sequence-duration' : options.sequenceDuration / 1000 + 's',
        //     '@av-animation-timing-function' : options.timingFunction,
        // } );
    }
);

( function( $ ) {
    $.fn.avToggle = function( callback ) {

        return this.each( function() {
            var el  = $( this );
            var sel = $('[class*=" av-sequence-"]', this);

            if ( el.hasClass( "av-hidden" ) ) {
                toggleItem ( el, options.duration );
            } else {
                setTimeout( function() {
                    toggleItem ( el, options.duration );
                    callback();
                }, ( sel.length - 1 ) * options.sequenceInterval + options.sequenceDuration );
            }

            if ( options.sequence && sel.length > 0 ) {
                var order = 0;

                if ( !el.hasClass( "av-hidden" ) ) {
                    sel.reverse();
                }

                sel.each(function(){
                    var el = $( this );
                    setTimeout( function(){
                        toggleItem( el, options.sequenceDuration );
                    }, options.sequenceInterval * order );
                    order += 1;
                })

            } else {
                //toggleItem ( el, options.duration );
            }

            function toggleItem ( el, duration ) {
                if ( el.hasClass( "av-hidden" ) ) {
                    el.css( { 'display' : 'block' } );
                    setTimeout( function(){
                        el.removeClass('av-hidden');
                    }, 0 );

                } else {
                    el.addClass('av-hidden');
                    setTimeout( function(){
                        el.css( { 'display' : 'none' } );
                    }, duration );
                }
            }

        } );
    };

    $.fn.reverse = [].reverse;
} ) ( jQuery );
