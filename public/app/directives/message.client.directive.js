angular.module('funstart').directive('messagePanel', function () {
    return {
        'templateUrl': '/app/templates/messagePanel.tmpl.html',
        'scope': {
            item: '='
        }
    }
});
angular.module('funstart').directive('messageFrame', function () {
    return {
        'templateUrl': '/app/templates/messageFrame.tmpl.html',
        'scope' : {
            type: '='
        }
    }
});