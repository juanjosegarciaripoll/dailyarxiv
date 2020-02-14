/* -*- mode: javascript; js-indent-level: 2 -*- */
/**********************************************************************
 * arXiv interface
 */

function queryToUrl(query, date) {
  var to = previousArxivDay(date);
  var from = previousArxivDay(to);
  return 'query.php?search_query=(' + query + ')+AND+lastUpdatedDate:['
    + dateToArxivDate(from, true) + '+TO+'
    + dateToArxivDate(to, false)
    + ']&max_results=800';
}

function idListToUrl(list) {
  return 'query.php?id_list=' + list + '&max_results=800';
}

function articlesIdList(articles) {
  var l = articles.length;
  var output = [];
  for (var i = 0; i < l; ++i) {
    if (articles[i].saved) {
      output.push(articles[i].id);
    }
  }
  return output.join(',');
}

function composeMail(articles) {
  return 'mailto:?subject=' +
    encodeURIComponent('Check this arXiv list') +
    '&body=' +
    encodeURIComponent('http://dailyarxiv.com/arxiv-list.html#/id_list?ids='+articlesIdList(articles));
}

function makeReadingList($cookies) {
  var readingList = {};
  var list = $cookies.getObject('arxivReadingList') || {};

  readingList.put = function (article) {
    list[article.id] = article;
    $cookies.putObject('arxivReadingList', list);
  }
  readingList.remove = function (article) {
    delete list[article.id];
    $cookies.putObject('arxivReadingList', list);
  }
  readingList.clear = function () {
    list = {};
    $cookies.putObject('arxivReadingList', list);
  }
  readingList.get = function (id) {
    return list.hasOwnProperty(id) && list[id];
  }
  readingList.toRead = function () {
    return this.array().length != 0;
  }
  readingList.array = function () {
    var output = [];
    for (var v in list)
      if (list.hasOwnProperty(v)) {
        output.push(v);
      }
    return output;
  }
  readingList.articles = function () {
    var output = [];
    for (var v in list)
      if (list.hasOwnProperty(v)) {
        output.push(list[v]);
      }
    return output;
  }
  return readingList;
}

angular
  .module('arxivApp', ['ngCookies','ui.router','arxivList','arxivSelector','arxivCalendar'])
  .controller('mainCtrl', function ($scope, $state, $cookies) {
    $scope.query = $cookies.get('arxivLastSelection');
    $scope.date = "today";
    $scope.errorMsg = null;
    $scope.readingList = makeReadingList($cookies);

    $scope.loadList = function (query, date) {
      if (query) {
        $cookies.put('arxivLastSelection',query);
        var last_date = $cookies.getObject('arxivLastDate');
        if (last_date && last_date < date) {
          $cookies.putObject('arxiLastDate',date);
        }
        $state.go('list', { query: query, date: date});
      }
    }
    $scope.loadReadingList = function () {
      $state.go('saved');
    }
  })
  .controller('listCtrl', function ($scope, $cookies, $http, $state, $stateParams) {
    $scope.query = $stateParams.query;
    if ($stateParams.date == 'today')
      $scope.date = new Date();
    else if ($stateParams.date)
      $scope.date = new Date($stateParams.date);
    else
      $scope.date = new Date();
    $scope.xml = null;
    $scope.articles = null;
    $scope.readingList = makeReadingList($cookies);

    $scope.prevPage = function () {
      $state.go('list', {query: $scope.query, date: previousArxivDay($scope.date)});
    }

    $scope.nextPage = function () {
      $state.go('list', {query: $scope.query, date: nextArxivDay($scope.date)});
    }

    $scope.url = queryToUrl($scope.query, $scope.date);
    $http({
      method: "GET",
      url: $scope.url
    }).then(function mySuccess(response) {
      $scope.xml = response.data;
      $scope.articles = xmlToJSON(response.data, $scope.readingList);
      $scope.errMsg = '';
    }, function myError(response) {
      $scope.xml = null;
      $scope.errMsg = response.statusText;
    });
  })
  .controller('savedListCtrl', function ($scope, $cookies, $state) {
    $scope.readingList = makeReadingList($cookies);
    $scope.articles = $scope.readingList.articles();
    $scope.mailto = composeMail($scope.articles);
    $scope.clearAndExit = function () {
      $scope.readingList.clear();
      $scope.articles = {};
      $state.go('default');
    }
  })
  .controller('savedIdListCtrl', function ($scope, $cookies, $http, $state, $stateParams) {
    $scope.ids = $stateParams.ids;
    $scope.readingList = makeReadingList($cookies);
    $scope.articles = {};
    $scope.mailto = '#';
    if ($scope.ids) {
      $scope.url = idListToUrl($scope.ids);
      $http({
        method: "GET",
        url: $scope.url
      }).then(function mySuccess(response) {
        $scope.xml = response.data;
        $scope.articles = xmlToJSON(response.data, $scope.readingList);
        $scope.mailto = composeMail($scope.articles);
        $scope.errMsg = '';
      }, function myError(response) {
        $scope.xml = null;
        $scope.errMsg = response.statusText;
      });
    }
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('default', {
        url: '',
        templateUrl: 'template/arxiv-page-main.html',
        controller: 'mainCtrl'
      })
      .state('list', {
        url: '/list?query&date',
        templateUrl: 'template/arxiv-page-list.html',
        controller: 'listCtrl'
      })
      .state('saved', {
        url: '/saved',
        templateUrl: 'template/arxiv-page-saved.html',
        controller: 'savedListCtrl'
      })
      .state('id_list', {
        url: '/id_list?ids',
        templateUrl: 'template/arxiv-page-saved.html',
        controller: 'savedIdListCtrl'
      });
  })
  .directive('arxivFooter', function () {
    return {
      restrict: 'E',
      templateUrl: 'template/arxiv-footer.html'
    };
  });
