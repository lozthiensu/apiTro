/**
 * Created by andh on 8/9/16.
 */
angular.module('funstart').controller('NavbarController', ['$timeout', '$q','$log','$scope','$location','NavGamesService','$mdMenu','$mdDialog','$mdSidenav','$rootScope',
    function($timeout, $q,$log,$scope,$location,NavGamesService,$mdMenu,$mdDialog,$mdSidenav,$rootScope){
    $scope.initNavbar = function(){
        $scope.games = NavGamesService;
        $scope.games.loadRandomGames();
        $scope.isSearching = false;
    }
    if($location.path().indexOf('game')>=0){
        $scope.isRecommend = true;
    } else {
        $scope.isRecommend = false;
    }
    $scope.isDisplaySearch = function(){
        if($(window).width()>=960) return true;
        return $scope.isSearching;
    }
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
        return $mdSidenav('right').isOpen();
    };

    $scope.isOpenLeft = function(){
        return $mdSidenav('left').isOpen();
    };
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
        return function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                });
        }
    }
    $scope.closeLeft = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('left').close()
            .then(function () {
                // $log.debug("close LEFT is done");
            });
    };
    $scope.closeRight = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').close()
            .then(function () {
                // $log.debug("close RIGHT is done");
            });
    };
    $scope.openMenu = function(m,e){
        m(e);
        $mdMenu.hide();
    };
    $scope.showSigninDialog = function(ev) {
        $mdDialog.show({
                controller: ['$scope', '$mdDialog',function($scope, $mdDialog) {
                    $scope.hide = function() {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                }],
                templateUrl: 'app/templates/authDialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
            .then(function() {

            }, function() {

            });
    };
    $scope.$on("$routeChangeStart", function(event, next, current) {
        if('gameId' in next.params){
            $scope.isRecommend = true;
        } else {
            $scope.isRecommend = false;
        }

    });
    $scope.games = NavGamesService;
    $scope.querySearch = function(query) {
        $scope.games.text = query;
        deferred = $q.defer();
        $scope.games.searchGames(function(results){
            deferred.resolve(results);
        })
        return deferred.promise;
    }
    $scope.gotoLink = function(selectedItem){
        window.location.href = '/game/'+selectedItem._id+'?utm_campaign=tracking&utm_source=search&utm_medium=' + $rootScope.login;
    }


}]);
