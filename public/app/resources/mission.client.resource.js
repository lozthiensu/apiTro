/**
 * Created by andh on 8/12/16.
 */
angular.module('funstart').factory('Missions', ['$resource',
    function($resource) {
        return $resource('api/missions/:missionId', {
            missionId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
angular.module('funstart').service('MissionsService',['Missions',function(Missions){
    var self = {
        'isLoading': false,
        'data': [],
        'findMissionByGame': function(gameId,callback){
            var arr = [];
            angular.forEach(self.data,function(e){

                if(e.quest.game._id == gameId && e.point<e.quest.goal){
                    arr.push(e);
                }

            })
            callback(arr);
        },
        'loadMissions': function (user) {
            if (!self.isLoading) {
                self.isLoading = true;
                var params = {
                    user: user
                }
                Missions.get(params,function (res) {
                    angular.forEach(res.data, function (mission) {
                        var hour = Math.floor(mission.remaining/3600);
                        var rest = mission.remaining - hour*3600;
                        var min = Math.floor(rest/60);
                        mission.remain = 'Còn '+hour+' giờ '+min+' phút';
                        self.data.push(new Missions(mission));
                    });
                    self.isLoading = false;
                });
            }
        },
        'updateMission': function(obj,params,callback){
            var temp = new Missions(obj);
            temp.$update(params,function(res){
               if(callback) callback(res);
            });
        }

    };
    return self;

}]);
//
// if($rootScope.user && $routeParams.gameId){
//     $rootScope.missions.findMissionByGame($routeParams.gameId,function(missions){
//         var i = 0;
//         if(missions.length){
//             angular.forEach(missions,function(mission){
//                 $rootScope.missions.updateMission(mission,{point: data},function(res){
//                     if(res.data){
//                         i++;
//                         if(i == missions.length){
//                             $scope.setActivity(data);
//                         }
//                         mission.point = res.data.point;
//                         if (mission.point>=mission.quest.goal){
//                             var toast1 = $mdToast.simple()
//                                 .textContent('Chúc mừng! Bạn đã hoàn thành một nhiệm vụ')
//                                 .theme('md-accent')
//                                 .position('bottom left');
//                             $mdToast.show(toast1).then(function(response) {
//                                 //callback
//                             });
//                         } else {
//                             var toast2 = $mdToast.simple()
//                                 .textContent('Chúc mừng! Nhiệm vụ đã được cập nhật')
//                                 .position('bottom left');
//                             $mdToast.show(toast2).then(function(response) {
//                                 //callback
//                             });
//                         }
//                     }
//                 });
//             })
//             console.log($scope.isEnd);
//         } else {
//             console.log($scope.isEnd);
//             $scope.setActivity(data);
//         }
//
//
//     });
// }