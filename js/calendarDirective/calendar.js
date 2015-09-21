app.directive("calendar",[ '$filter', '$timeout', function( $filter, $timeout ) {
    return {
        restrict: "E",
        templateUrl: "js/calendarDirective/calendar.html",
        scope: {
            selected: "=",
            sessions: "=",
            display:  "=",
            onchange: "&"
        },
        link: function( scope, filter ) {

            scope.$watch( "display.month()", function() {
                console.log("Build month");
                scope.selected = moment();
                scope.month = scope.display.clone();

                var start = scope.display.clone();
                start.date(1);
                _removeTime(start.day(0));
                _buildMonth(scope, start, scope.month);
            })

            scope.select = function( day ) {
                scope.selected = day.date;
                scope.$apply();
                scope.onchange();
            }

            scope.next = function() {
                var next = scope.month.clone();
                _removeTime(next.month(next.month()+1).date(1));
                scope.month.month(scope.month.month()+1);
                scope.display = scope.month.clone();
                _buildMonth(scope, next, scope.month);
            }

            scope.previous = function() {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month()-1).date(1));
                scope.month.month(scope.month.month()-1);
                scope.display = scope.month.clone();
                _buildMonth(scope, previous, scope.month);
            }

            scope.getFixTime = function ( day ) {
                if ( scope.sessions [ day.format('D-M-YYYY') ] ) {
                    return scope.sessions [ day.format('D-M-YYYY') ].w;
                }
                else { return false }
            }

            scope.isCompensation = function ( day ) {
                if ( scope.sessions [ day.format('D-M-YYYY') ] ) {
                    return scope.sessions [ day.format('D-M-YYYY') ].c;
                }
            }
        }
    };

    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        $('.calendar .week').addClass('av-hidden');
        return days;
    }
}])
