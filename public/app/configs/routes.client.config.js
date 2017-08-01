angular.module('funstart').config([
    '$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        $routeProvider.when('/', {
            templateUrl: '/app/views/index.html'
        }).when('/game/:gameId', {
            templateUrl: '/app/views/game.html',
            reloadOnSearch: false
        }).
        when('/user/:username',{
            templateUrl: '/app/views/user.html'
        }).
        when('/test/:key/:gameId',{
            templateUrl: '/app/views/test.html'
        }).
        when('/all', {
            templateUrl: '/app/views/topic.html'
        })
        .when('/topic/:topicId', {
            templateUrl: '/app/views/topic.html'
        }).
        when('/action/verify/:token',{
            templateUrl: '/app/views/login.html'
        }).
        when('/login',{
            templateUrl: '/app/views/login.html'
        }).
        when('/avatar', {
            templateUrl: '/app/views/avatar.html'
        }).
        when('/action/reset/:token', {
            templateUrl: '/app/views/login.html'
        }).
        when('/action/:token', {
            templateUrl: '/app/views/action.html'
        }).
        when('/policy', {
            templateUrl: '/app/views/policy.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    }
]);