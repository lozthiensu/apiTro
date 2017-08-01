angular.module('funstart').directive('activityCard', function () {
    return {
        'templateUrl': '/app/templates/activityCard.tmpl.html',
        'scope': {
            item: '='
        }
    }
});