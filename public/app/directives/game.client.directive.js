/**
 * Created by andh on 7/28/16.
 */

angular.module('funstart').directive('gameCard', function () {
    return {
        'templateUrl': '/app/templates/gameCard.tmpl.html',
        'scope': {
            item: '=',
            source: '='
        }
    }
});
angular.module('funstart').directive('recommendCard', function () {
    return {
        'templateUrl': '/app/templates/recommendCard.tmpl.html',
        'scope': {
            item: '='
        }
    }
});
angular.module('funstart').directive('thumbCard', function () {
    return {
        templateUrl: 'app/templates/thumbCard.tmpl.html',
        scope: {
            item : '='
        }
    }
});