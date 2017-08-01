/**
 * Created by andh on 7/28/16.
 */
angular.module('funstart').controller('GamesController', ['$scope','$rootScope','$routeParams', '$location','GamesService',
    function($scope,$rootScope, $routeParams, $location, GamesService){
        document.title = 'Fun Start';
        $scope.loadGames = function() {
            $scope.games = GamesService;
            if($routeParams.topicId!=null){
                $scope.games.topic = parseInt($routeParams.topicId);
            }
            $scope.games.reload();
        };
        $scope.loadMore = function(){
            $scope.games.loadMore();
        };
        $scope.doOrder = function(type){
            $scope.games.order = type;
            $scope.games.reload();
        }

    }]);
angular.module('funstart').controller('IndexController', ['$scope','$rootScope','IndexService',
    function($scope,$rootScope, IndexService){
        document.title = 'Fun Start';
        $scope.games = IndexService;
        $scope.loadGames = function() {
            $scope.games.initData('new');
            $scope.games.loadGames(function () {
                $scope.games.initData('topic');
                $scope.games.topic = 0;
                for (var i = 0; i < $rootScope.topics.length; i++) {
                    $scope.games.loadGames();
                }

            });
        }
    }]);