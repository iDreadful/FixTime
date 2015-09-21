var app = angular.module( 'app', [ 'ngTouch', 'ngSanitize' ] );

app.controller( 'appController', function( $scope, $http, $timeout ) {

    /*
        Init some vars
    */
    var currentView = 'home';
    var previousView = 'home';

    /*§
        Default settings
    */
    var defaultSettings = {
        appversion          : 0.02,
        appuuid             : uuidgen(),
        defaultWork         : 32, // this needs to be index of necessary minutes amount from hoursMinutesElements
        theme               : 0,
    }

    /*
        Defaulst sessions
    */
   var defaultSessions = { };

    /*
        Themes names
    */
    $scope.themes = [
        'Early Wake',
        'Ocean Wave',
        'North Sunset',
        'Green Grass',
        'Clean Sky',
        'Deep Night',
        'iOS Style'
    ];

    /*
        Date sliders elements generation
        this rows of numbers are needed for proper sliders work.
    */
    var numberOfHours = 12;
    $scope.hoursElements = new Array();
    for ( index = 0 ; index <= numberOfHours * 60 ; index += 60 ) {
        $scope.hoursElements.push( index );
    }
    var minutesStep = 15;
    $scope.minutesElements = new Array();
    for ( index = 0 ; index <= 55 ; index += minutesStep ) {
        $scope.minutesElements.push( index );
    }
    $scope.hoursMinutesElements = new Array();
    for ( index = 0 ; index <= numberOfHours * 60 ; index += minutesStep ) {
        $scope.hoursMinutesElements.push( index );
    }

    /*
    * Switch views
    */
    $scope.switchView = function ( targetView ) {

        switch ( targetView ) {
            case 'sessions':
            case 'home':
            case 'settings':

                //Use callback to run tasks after all animations complete
                $( '.view.' + currentView ).avToggle( function() {
                    $( '.view.' + targetView ).avToggle();
                });

                previousView = currentView;
                currentView = targetView;
            break;

            case 'back':
                //from edit to sessions
                if (currentView == 'edit' && previousView == 'home') {
                    $('.view.edit').hide();
                    $('.view.home').show();
                }
                //from edit to home
                if (currentView == 'edit' && previousView == 'sessions') {
                    $('.view.edit').hide();
                    $('.view.sessions').show();
                }
                //from settings to home
                if (currentView == 'settings' && previousView == 'home') {
                    $('.view.settings').hide();
                    $('.view.home').show();
                }

            break;
        }
        console.log (previousView + '->' + targetView);
    }

    /*
        Loading settings from LS or put defaults there
    */
    // Are there any settings in LS?
    if ( !localStorage.getItem( "settings" ) ) {
        // No, write defaults please
        localStorage.setItem (
            "settings", JSON.stringify( defaultSettings )
        );
        // And use them as current settings
        $scope.settings = angular.copy( defaultSettings );
        startWatchingSettings();
        $scope.switchView( 'home' );

    } else {
        // Yes, load them please
        $scope.settings = JSON.parse( localStorage.getItem( 'settings' ) );
        startWatchingSettings();
        $scope.switchView( 'home' );
    }

    // Are there any sessions in LS?
     if ( !localStorage.getItem( "sessions" ) ) {
        // No, write an empty sessions
        localStorage.setItem( "sessions", JSON.stringify( defaultSessions ) );
        $scope.sessions = angular.copy( defaultSessions );
     } else {
        // Yes, load them please
        $scope.sessions = JSON.parse( localStorage.getItem( "sessions" ) );
     }

    // Reset local storage and write defaults
    $scope.resetLocalStorage = function() {
        // Trying to keep UUID for the app
        defaultSettings.appuuid = $scope.settings.appuuid;

        localStorage.clear();

        localStorage.setItem( "settings", JSON.stringify( defaultSettings ) );
        localStorage.setItem( "sessions", JSON.stringify( defaultSessions ) );

        $scope.settings = angular.copy( defaultSettings );
        $scope.sessions = angular.copy( defaultSessions );
    }

    //Save current session
    $scope.saveCurrentSession = function() {
        $scope.sessions[ storeSessionFormat ( $scope.selectedDate ) ] = { w : $scope.hoursElements[ $scope.hoursIndex ] + $scope.minutesElements[ $scope.minutesIndex ], c : $scope.editSession.c };
        localStorage.setItem( "sessions", JSON.stringify( $scope.sessions ) );

        /*
            $scope.sessions[ storeSessionFormat ($scope.editSession.date) ] = $scope.editSession;
        */
     }

    // Save settings upon update

    function startWatchingSettings() {
        $scope.$watchCollection('settings', function() {
            localStorage.setItem( "settings", JSON.stringify( $scope.settings ) );
        } )
    }

    /*
        Some stuff to work with calendar and date picker
    */

    //Select previous month
    $scope.previousMonth = function() {
        $scope.displayDate.subtract( 1, 'months' );
    }

    //Select next month
    $scope.nextMonth = function() {
        $scope.displayDate.add( 1, 'months' );
    }

    //Select current month (go to today)
    $scope.currentMonth = function() {
        $scope.displayDate = moment();
    }

    //Select previous day
    $scope.previousDay = function() {
        $scope.selectedDate.subtract( 1, 'days' );
            $scope.editSessionHours = true;
            $scope.editSessionMinutes = false;

            if ( $scope.sessions[ storeSessionFormat ( $scope.selectedDate ) ] ) {
                $scope.editSession = $scope.sessions[ storeSessionFormat ( $scope.selectedDate ) ];
            } else {
                $scope.editSession = {
                    w : $scope.hoursMinutesElements [ $scope.settings.defaultWork ],
                    c : false
                }
            }

            $scope.hoursIndex   = ( $scope.editSession.w - $scope.editSession.w % 60 ) / 60;
            $scope.minutesIndex = ( $scope.editSession.w % 60) / minutesStep;
    }

    //Select next day
    $scope.nextDay = function() {
        $scope.selectedDate.add( 1, 'days' );
            $scope.editSessionHours = true;
            $scope.editSessionMinutes = false;

            if ( $scope.sessions[ storeSessionFormat ( $scope.selectedDate ) ] ) {
                $scope.editSession = $scope.sessions[ storeSessionFormat ( $scope.selectedDate ) ];
            } else {
                $scope.editSession = {
                    w : $scope.hoursMinutesElements [ $scope.settings.defaultWork ],
                    c : false
                }
            }

            $scope.hoursIndex   = ( $scope.editSession.w - $scope.editSession.w % 60 ) / 60;
            $scope.minutesIndex = ( $scope.editSession.w % 60) / minutesStep;

    }


    //Getting current date
    $scope.currentDate = moment();
    $scope.displayDate = $scope.currentDate.clone();
    $scope.selectedDate = $scope.currentDate.clone();

    //Formats string to store in storage
    function storeSessionFormat ( date ) {
        return date.format('D-M-YYYY');
    }

    /*
        Switch theme
    */
    $scope.$watch('settings.theme', function() {
        less.modifyVars ( {
            '@theme': $scope.settings.theme,
        } );
    })

    /*
        Working with time balance
    */

    //Get time balance
    $scope.getTimeBalance = function () {
        if ( $scope.sessions ) {
            var timeBalance = 0;
            for ( var session in $scope.sessions ) {
                if ( ! $scope.sessions [ session ].c ){
                    timeBalance += $scope.sessions[ session ].w - $scope.hoursMinutesElements [ $scope.settings.defaultWork ];
                } else {
                    timeBalance += $scope.sessions[ session ].w;
                }
             }
            return timeBalance;
        } else {
            return 0;
        }
    }

    /*
        Switch dialogs
    */

    $scope.toggleDialog = function ( targetDialog ){
        switch ( targetDialog ) {

            /*
                Reset settings dialog
            */
            case 'reset':
                $(".view." + currentView).toggleClass("blured");
                $('.dialog.reset').avToggle();
            break;

            /*
                Edit session dialog
            */
            case 'edit':
                $scope.editSessionHours = true;
                $scope.editSessionMinutes = false;

                if ( $scope.sessions[ storeSessionFormat ( $scope.selectedDate ) ] ) {
                    $scope.editSession = $scope.sessions[ storeSessionFormat ( $scope.selectedDate ) ];
                } else {
                    $scope.editSession = {
                        w : $scope.hoursMinutesElements [ $scope.settings.defaultWork ],
                        c : false
                    };
                }

                $scope.hoursIndex   = ( $scope.editSession.w - $scope.editSession.w % 60 ) / 60;
                $scope.minutesIndex = ( $scope.editSession.w % 60) / minutesStep;

                $(".view." + currentView).toggleClass("blured");
                $('.dialog.edit').avToggle();
            break;

            /*
                Import sessions dialog
            */
            case 'import':
                $( ".view." + currentView ).toggleClass( "blured" );
                $( '.dialog.import' ).avToggle();
            break;

            /*
                Export sessions dialog
            */
            case 'export':
                $( ".view." + currentView ).toggleClass( "blured" );
                $( '.dialog.export' ).avToggle();
            break;
        }
    }

    $scope.makeExportLink = function () {

        $scope.getLinkInProgress = true;
        $scope.exportError = false;

        $scope.exportLink = "";
        var data = {
            settings: $scope.settings,
            sessions: $scope.sessions,
        }
        getLink( data, function( link ) {
            $scope.getLinkInProgress = false;
            $scope.getLinkComplete = true;
            $scope.exportLink = link;
        } );

        function getLink( json, callback ) {
            var data = JSON.stringify( json );
            var pieceLength = 1000;
            var key = "AIzaSyANFw1rVq_vnIzT4vVOwIw3fF1qHXV7Mjw";
            var pieces = [];
            var position = 0;

            while ( position < data.length ) {
                pieces.push( data.substr( position, pieceLength ) );
                position += pieceLength;
            }

            function iterator( pieces, offset, link ) {
                if ( offset >= 0 ) {
                    $http.post( "https://www.googleapis.com/urlshortener/v1/url?key=" + key,
                        {
                            "longUrl" : "http://timefix.io/" + pieces[ offset ] + '-::-' + link,
                            "auth_token" : key,
                        } ).
                    success( function( data, status, headers, config ) {
                        return iterator ( pieces, offset - 1, data.id );
                    } ).
                    error( function( data, status, headers, config ) {
                        $scope.exportError = true;
                        $scope.getLinkInProgress = false;
                    } );
                } else {
                    return callback( link );
                }
            }
            return iterator( pieces, pieces.length - 1, "" );
        }
    }

    $scope.importLink = "";

    $scope.importDataFromLink = function ( link ) {

        $scope.getDataInProgress = true;
        $scope.importError = false;

        getData( link, function( data ) {
            $scope.getDataInProgress = false;
            $scope.getDataComplete = true;

            $scope.sessions = JSON.parse( data ).sessions;
            $scope.settings = JSON.parse( data ).settings;

            localStorage.setItem( 'sessions', JSON.stringify( $scope.sessions ) );
            localStorage.setItem( 'settings', JSON.stringify( $scope.settings ) );

            $scope.toggleDialog( 'import' );
            $scope.switchView( 'home' );
        } );

        // Get data from URL chain
        function getData ( link, callback ) {
            var key = "AIzaSyANFw1rVq_vnIzT4vVOwIw3fF1qHXV7Mjw";

            // This will be repeated fo revery piece
            function iterator ( link, glue ) {
                $http.get( "https://www.googleapis.com/urlshortener/v1/url?key=" + key + "&shortUrl=" + link ).
                success( function( data, status, headers, config ) {
                    // Extracting data and link to next piece if any
                    parts = data.longUrl.split('-::-');
                    // Glueing data. Removing requiered by google apis URL
                    glue += parts[ 0 ].replace( "http://timefix.io/" , "" );
                    // Check if there is a link to next piece of data
                    if ( parts[ 1 ] ) {
                        // Fetch next piece
                        return iterator( parts [ 1 ], glue );
                    } else {
                        // Executing callback function
                        return callback( decodeURIComponent( glue ) );
                    }
                } ).
                error( function(data, status, headers, config ) {
                    $scope.importError = true;
                    $scope.getDataInProgress = false;
                } );
            }
            return iterator( 'http://goo.gl/' + link, "" );
        }
    }
} )

app.filter('formatTimeComponents', function() {
    return function ( input ) {
        return ( Math.abs( input ) < 10 ) ? '0' + Math.abs( input ) : Math.abs( input );
    };
});

app.filter('formatLink', function() {
    return function ( input ) {
        if ( input ) {
            return input.replace( "http://goo.gl/", "" );
        } else {
            return "";
        }
    };
});
