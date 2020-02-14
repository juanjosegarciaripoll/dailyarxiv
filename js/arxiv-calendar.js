/* -*- mode: javascript; js-indent-level: 2 -*- */

angular
  .module('arxivCalendar', [])
  .directive('arxivCalendar', function () {
    return {
      restrict: 'E',
      scope: {
	selection: '='
      },
      templateUrl: 'template/arxiv-calendar.html',
      link: function ($scope) {
	var today = new Date();
	$scope.focus = null;
	$scope.date = today;
	$scope.today = today;

	/* If we saved the last date in the cookies, compute the
	 * next readable date. */
	$scope.lastUnseen = null;

	/* Information to fill the calendar */
	$scope.weeks = fillCalendar(emptyCalendar(), today);
	$scope.monthName = function () {
	  var names = [
	    'January', 'February', 'March', 'April',
	    'May', 'June', 'July', 'August',
	    'September', 'October', 'November', 'December'];
	  return names[$scope.date.getMonth()];
	}
	$scope.year = function () {
	  return $scope.date.getFullYear();
	}

	/* Navigation functions */
	$scope.previousMonth = function () {
	  var date = $scope.date;
	  var month = date.getMonth();
	  if (month == 0) {
	    date = new Date(date.getFullYear()-1, 11, 1);
	  } else {
	    date = new Date(date.getFullYear(), month-1, 1);
	  }
	  moveCalendar($scope, date);
	}
	$scope.nextMonth = function () {
	  var date = $scope.date;
	  var month = date.getMonth();
	  if (month == 11) {
	    date = new Date(date.getFullYear()+1, 0, 1);
	  } else {
	    date = new Date(date.getFullYear(), month+1, 1);
	  }
	  moveCalendar($scope, date);
	}
	$scope.select = function (day) {
	  if ($scope.focus) {
	    $scope.focus.selected = false;
	  }
	  $scope.focus = day;
	  day.selected = true;
	  $scope.selection = day.date;
	}
	$scope.gotoDate = function (date) {
	  date = date || new Date();
	  moveCalendar($scope, date);
	  var focus = findDay($scope, date);
	  if (focus) {
	    focus.selected = true;
	    $scope.focus = focus;
	    $scope.selection = date;
	  }
	}
      }
    };

    function findDay($scope, date) {
      for (var i = 0; i < $scope.weeks.length; ++i) {
	var days = $scope.weeks[i];
	for (var j = 0; j < days.length; ++j) {
	  var otherDate = days[j].date;
	  if (otherDate &&
	      (otherDate.getFullYear() == date.getFullYear()) &&
	      (otherDate.getMonth() == date.getMonth()) &&
	      (otherDate.getDate() == date.getDate()))
	    return days[j];
	}
      }
      return null;
    }
 
    function emptyCalendar() {
      var weeks = [];
      var i = 0;
      for (var w = 0; w < 6; ++w) {
	var days = [];
	for (var d = 0; d < 7; ++d) {
	  days.push({ date: null, day: null, selected: false,
		      holiday: ((d==0) | (d==6)), code: ++i});
	}
	weeks.push(days);
      }
      return weeks;
    }

    function clearCalendar(weeks) {
      for (var w = 0; w < weeks.length; ++w) {
	var days = weeks[w];
	for (var i = 0; i < days.length; ++i) {
	  days[i].date = null;
	  days[i].day = null;
	  days[i].selected = null;
	}
      }
      return weeks;
    }

    function moveCalendar($scope, date) {
      fillCalendar($scope.weeks, $scope.date = date);
    }

    function fillCalendar(weeks, date) {
      clearCalendar(weeks);
      var month = date.getMonth();
      date = new Date(date.getTime());
      date.setDate(1);
      var offset = date.getDay();
      for (var dayOfMonth = 1;
	   (dayOfMonth < 32) && (date.getMonth() == month);
	   )
      {
	var dayOfWeek = date.getDay();
	var week = Math.floor((offset + dayOfMonth - 1) / 7);
	weeks[week][dayOfWeek].date = new Date(date.getTime());
	weeks[week][dayOfWeek].day = dayOfMonth;	
	date.setDate(++dayOfMonth);
      }
      return weeks;
    }

  });
