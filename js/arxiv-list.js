/* -*- mode: javascript; js-indent-level: 2 -*- */
/*
 * Convert the XML data returned by the arXiv API into a collection
 * of JSON records with the following properties:
 *	title:		Paper title
 *	authors:	Comma separated list of authors
 *      link:           arXiv ID in URL form
 *      abs:            abstract
 *      pdf_link:       Link to PDF
 *      published:      Date published
 *      updated:        Date updated
 *      code:           Index into the JSON array
 */
function xmlToJSON(xml, readingList) {
  var nodes = [];
  $(xml).find('entry').each(function(){
    var authors = "";
    var node = $(this);
    node.find('author').each(function () {
      if (authors) { authors += ", "; }
      authors += $(this).find('name').text();
    });
    // Link to arXiv page
    var link = node.children('id').text();
    // Article arXiv id is obtained from the link
    var id = link.substr('http://arxiv.org/abs/'.length);
    var published = node.children('published').text().substr(0, 10);
    var updated = node.children('updated').text().substr(0, 10);
    nodes.push({
      id: id,
      link: link,
      // Article information
      title: node.children('title').text(),
      authors: authors,
      abs: node.children('summary').text(),
      pdf_link:  node.children('[title="pdf"]').attr('href'),
      published: published,
      updated: published != updated,
      saved: (readingList && readingList.get(id)) ? true: false,
      open: false,
      code: 0
    });
  });
  nodes = nodes.sort(function (a,b) {
    return (a.published > b.published) ? -1 : 1;
  });
  var n;
  var l = nodes.length;
  if (l) {
    for (n = 0; n < l; ++n) {
      nodes[n].code = n;
    }
  }
  return nodes;
}

angular
  .module('arxivList', [])
  .directive('arxivShare', function () {
    return {
      restrict: 'E',
      scope: {
        text: '@',
        link: '@'
      },
      template: '<a href="https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fwww.dailyarxiv.com&hashtags=dailyarxiv&text={{shape(text)}}&url={{link}}"><img src="media/twitter.png" alt="tweet"/></a>&nbsp;<a href="http://www.facebook.com/sharer.php?u={{link}}" target="_blank"><img src="media/facebook.png" alt="Share on Facebook"/></a>',
      link: function ($scope) {
	$scope.shape = function (text) {
	  return encodeURIComponent(text);
	}
      }
    };
  })
  .directive('arxivList', function() {
    return {
      restrict: 'E',
      scope: {
        articles: '=',
	saveTo: '=',
      },
      templateUrl: 'template/arxiv-list.html',
      link: function ($scope) {
	$scope.toggle = function (article, newState) {
	  article.open = newState;
	}
	$scope.save = function (article) {
	  if (article && $scope.saveTo) {
	    if (article.saved) {
	      $scope.saveTo.put(article);
	    } else {
	      $scope.saveTo.remove(article);
	    }
	  }
	}
      }
    };
  });
