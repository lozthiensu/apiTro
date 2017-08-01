angular.module('funstart').controller('FeedController',['$scope','ActivitiesService',
    function($scope,ActivitiesService){
        $scope.loadInfomations = function(id){
            $scope.activities = ActivitiesService;
            $scope.activities.init(id);
            $scope.activities.loadActivities();
            console.log($scope.activities);
        };
    }]);