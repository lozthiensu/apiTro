// angular.module('funstart').directive('href', function() {
//     return {
//         compile: function(element) {
//             if(element.)
//             element.attr('target', '_blank');
//         }
//     };
// });
angular.module('funstart').directive('loadingCircle', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/templates/loadingCircle.tmpl.html',
        scope: {
            isLoading : '='
        }
    }
});
angular.module('funstart').directive('authTabs', function () {
    return {
        templateUrl: 'app/templates/authTabs.tmpl.html'
    }
});
angular.module('funstart').directive('navToolbar', function () {
    return {
        templateUrl: 'app/templates/navToolbar.tmpl.html'
    }
});
angular.module('funstart').directive('sliderRight', function () {
    return {
        templateUrl: 'app/templates/sliderRight.tmpl.html'
    }
});
angular.module('funstart').directive('sliderLeft', function () {
    return {
        templateUrl: 'app/templates/sliderLeft.tmpl.html'
    }
});
// angular.module('funstart').
// directive('myRefresh',function($location,$route){
//     return function(scope, element, attrs) {
//         element.bind('click',function(){
//             if(element[0] && element[0].href && element[0].href === $location.absUrl()){
//                 $route.reload();
//             }
//         });
//     }
// });
angular.module('funstart').directive('facebookComment', function () {
    function createHTML(href, numposts, width) {
        return '<div class="fb-comments" ' +
            'data-href="' + href + '" ' +
            'data-width="' + width + '" ' +
            'data-numposts="' + numposts + '" ' +
            '</div>';
    }

    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
            attrs.$observe('pageHref', function (newValue) {
                var href        = newValue;
                var numposts    = attrs.numposts    || 5;
                var width    = attrs.width    || $('#facebook-comment').width();
                console.log(width);
                elem.html(createHTML(href, numposts, width));
                FB.XFBML.parse(elem[0]);

            });
        }
    };
});
angular.module('funstart').directive('facebookLike', function () {
    function createHTML() {
        return '<div class="fb-page" data-href="https://www.facebook.com/FunStart/" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/FunStart/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/FunStart/">Fun Start</a></blockquote></div>';
    }
    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem) {

            setTimeout(function(){
                elem.html(createHTML());
                FB.XFBML.parse(elem[0]);
            },2000);

        }
    };
});