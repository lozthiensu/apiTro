/**
 * Created by andh on 8/10/16.
 */
/**
 * Created by andh on 7/28/16.
 */
angular.module('funstart').controller('PlayController', ['$scope','$rootScope','GamesService','ActivitiesService','SuggestService','ShareService','BattleService','TrackingService','Shooting','$location','$routeParams','$http','$timeout','$mdToast','$mdDialog','$interval',
    function($scope,$rootScope,GamesService,ActivitiesService,SuggestService,ShareService,BattleService,TrackingService,Shooting,$location,$routeParams,$http,$timeout,$mdToast,$mdDialog,$interval){
        $scope.loadGame = function(){
            $scope.isInit = true;
            $scope.games = GamesService;
            $scope.tracking = TrackingService;
            $scope.capturedImage = null;
            // $scope.maxScore = 20000;
            //load info this game
            $scope.games.loadGame($routeParams.gameId,function(){
                if($scope.games.currentGame.public){
                    eventAdsense.load({channel_id: '8788971041'});
                }
                document.title = $scope.games.currentGame.title;
                $scope.isInit = false;
                if($location.search().roomId){
                    if($rootScope.user){
                        $scope.isBattle = true;
                        $('body').css('overflow','hidden');
                        $scope.isPlay = true;
                        $scope.isEnd = false;
                        $scope.battle = BattleService;
                        $scope.battle.isLoading = true;
                        $scope.battle.init($scope.games.currentGame,$rootScope.user,$location.search().roomId,function(){
                            console.log('room err');
                            $scope.isBattle = false;
                            $('body').css('overflow','auto');
                            $scope.isPlay = false;
                            $location.search({});
                        });
                    } else {
                        $scope.showSigninDialog();
                    }
                }
            });
            //set order for recommend games and reset data list;
            $scope.games.order = 'random';
            $scope.games.hasMore = true;
            $scope.games.data = [];
            //set phase game play
            $scope.isLoad = true;
            $scope.isPlay = false;
            $scope.isEnd = false;
            $scope.isBattle = false;
            // $scope.time = Date.now();
            $scope.share = ShareService;

        };
        $scope.loadTest = function(){
            $scope.isInit = true;
            $scope.games = GamesService;
            //load info this game
            $timeout(function() {
                $scope.isInit = false;
                $scope.link = '/sources/game/' + $routeParams.gameId + '/';
                //set order for recommend games and reset data list;
                $scope.games.order = 'random';
                $scope.games.hasMore = true;
                $scope.games.data = [];
                //set phase game play
                $scope.isLoad = true;
                $scope.isPlay = false;
                $scope.isEnd = false;
                $scope.share = ShareService;
            }, 200);
        };
        $scope.finishLoading = function(){
            if($rootScope.user){
                $scope.tracking.init('visit',$routeParams.gameId);
                $scope.tracking.track();
                $scope.user = {
                    _id: $rootScope.user._id,
                    username: $rootScope.user.username,
                    avatar: $rootScope.user.avatar,
                    displayName: $rootScope.user.displayName
                };
            } else {
                $scope.user = {
                    avatar: 'http://www.funstart.net/sources/avatar.jpg',
                    displayName: 'Người chơi'
                }
            }
            $scope.suggestFriends = SuggestService;
            $scope.isLoad = false;
            console.log('done load!');
            //init info share
            $scope.share.setInfo({
                name: ($scope.games.currentGame)?$scope.games.currentGame.title:'Funstart',
                url: location.href.split('?')[0],
                pic: ($scope.games.currentGame)?$scope.games.currentGame.thumbAds:'http://www.funstart.net/sources/ads.jpg',
                des: ($scope.games.currentGame)?$scope.games.currentGame.des:'Webgame Mini số 1 Việt Nam'
            });
            //load recommend games
            $scope.games.paging = 6;
            $scope.games.loadGames();

        };
        $scope.start = function(){
            
        };

        //filter display for mobile
        $scope.filterMobile = function(index){
            if($(window).width()<600) {
                if(index<3) return true;
                return false;
            } else {
                if(index<6) return true;
                return false;
            }

        }
        var timeCountdown = null;
        $scope.setTimeProgress = function () {
            if($scope.battle && $scope.battle.game && $scope.battle.game.time){
                if(timeCountdown) $interval.cancel(timeCountdown);
                $scope.battle.timedown = 100;
                timeCountdown = $interval(function() {
                    $scope.battle.timedown -= 10/$scope.battle.game.time;
                    if($scope.battle.timedown <= 0) $interval.cancel(timeCountdown);
                }, 100, 0, true);
            }
        }
        $scope.onPlay = function(){
            if($scope.battle && $scope.battle.room && $scope.battle.room.time){
                socket.on('turn',function(data){
                    // console.log('turn',data);
                    // console.log('play',$scope.isPlay);
                    if(!$scope.isPlay){
                        // console.log('vo day de doi host');
                        if(data[$rootScope.user._id] == 0){
                            $scope.battle.isHost = true;
                            // console.log('tao la host');
                        } else {
                            $scope.battle.isHost = false;
                        }
                    };
                    if($scope.battle.players){
                        Object.keys(data).forEach(function(e){
                            $scope.battle.players.forEach(function (player) {
                                if(player._id == e){
                                    player.turn = data[e];
                                    return true;
                                }
                            });
                        });
                        // console.log($scope.battle.players);
                    }
                    $scope.$apply();
                    $scope.setTimeProgress();
                });
                $scope.setTimeProgress();
            }
            $(window).scrollTop(0);
            $('body').css('overflow','hidden');
            $scope.isEnd = false;
            $scope.isPlay = true;
            $scope.start();
            if($rootScope.user){
                $scope.tracking.init('start',$routeParams.gameId);
                $scope.tracking.track();
            }

        }
        // $scope.onReplay = function(){
        //     $scope.isEnd = false;
        //     $scope.start();
        // };
        $scope.shareFacebook = function(){

        };
        $scope.onShareFacebook = function(){
            // $scope.share();
            $scope.tracking.init('share',$routeParams.gameId);
            $scope.tracking.track();
            $scope.shareFacebook();
        };
        $scope.skipAds = function() {
            eventAdsense.skipAds();
        }
        $scope.user = {};
        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };
        $scope.endGame = function(obj){
            // if()
            console.log('end!');
            $('body').css('overflow','auto');
            $timeout(function() {
                $scope.isEnd = true;
            });
            if($scope.games.currentGame.public){
                // $scope.time = Date.now();
                if($scope.games.currentGame.long && $scope.games.currentGame.long > 2){
                    eventAdsense.load({channel_id: '6660299449'});
                } else {
                    if(Math.floor(Math.random()*2)==1) eventAdsense.load({channel_id: '6660299449'});
                }

            }

            // else {
                // if(obj.score > $scope.maxScore){
                //     $mdDialog.show({
                //             controller: ['$scope','score',function($scope, score) {
                //                 console.log('vo day');
                //
                //                 // $scope.capturing = capturing;
                //                 // $scope.captured = captured;
                //                 // $scope.capturedImage = capturedImage;
                //                 // $scope.user = user;
                //                 if(score >= 30000){
                //                     $scope.percent = Math.floor(Math.random()*10) + 90;
                //                     $scope.image = '/img/3star.svg';
                //                     $scope.maxScore = 100000;
                //                 } else if (score >= 25000) {
                //                     $scope.percent = Math.floor(Math.random()*10) + 70;
                //                     $scope.image = '/img/2star.svg';
                //                     $scope.maxScore = 30000;
                //                 } else {
                //                     $scope.percent = Math.floor(Math.random()*10) + 60;
                //                     $scope.image = '/img/1star.svg';
                //                     $scope.maxScore = 25000;
                //                 }
                //             }],
                //             locals: {score: obj.score},
                //             scope: $scope,        // use parent scope in template
                //             preserveScope: true,
                //             templateUrl: 'app/templates/shareDialog.tmpl.html',
                //             parent: angular.element(document.body)
                //         })
                //         .then(function(answer) {
                //
                //         }, function() {
                //
                //         });
                // }
            // }


            if(obj) $scope.setActivity(obj);
        };
        $scope.captureResult = function(obj,callback){
            obj._id = $routeParams.gameId;
            if($scope.battle && $scope.battle.opponent){
                obj.opponent = $scope.battle.opponent.avatar;
            }
            Shooting.save(obj,function(res){
                $scope.capturedImage = res.data;
                $scope.share.setInfo({pic: res.data});
                $scope.sharing = false;
                if(callback) callback();
            },function(err){
                if(callback) callback(err);
            })
        };
        $scope.uploadResult = function(obj,callback){
            var fd = new FormData();
            var url = '/api/uploadresult/' + $routeParams.gameId;
            // console.log(url);
            fd.append('file',obj.file);
            $http.post(url, fd, {
                    withCredentials : false,
                    headers : {
                        'Content-Type' : undefined
                    },
                    transformRequest : angular.identity
                })
                .success(function(res)
                {
                    console.log('obj ne',obj);
                    obj.pic = res.data;
                    $scope.share.setInfo(obj);
                    $scope.sharing = false;
                    if(callback) callback();
                })
                .error(function(res)
                {
                    console.log(res);
                    if(callback) callback();
                });

        };
        $scope.onReady = function(){
            $scope.battle.onReady();
        };
        $scope.setActivity = function(obj){
            $scope.isPlay = false;
            if($rootScope.user && $routeParams.gameId && obj.score){
                $scope.activity = ActivitiesService;
                obj.game = $routeParams.gameId;
                if($scope.battle && $scope.battle.players){
                    obj.opponents = [];
                    $scope.battle.players.forEach(function(player){
                        if(player._id != $rootScope.user._id){
                            obj.opponents.push(player._id);
                        }
                    });
                }
                $scope.activity.createActivity(obj,function (res) {
                    if(res.data.level > $rootScope.user.level){
                        $mdDialog.show({
                                controller: ['$scope','$mdDialog','data',function($scope, $mdDialog,data) {
                                    $scope.data = data;
                                    $timeout(function(){
                                        $scope.isCounting = true;
                                    });
                                    // $scope.percent = parseInt((data.exp - data.level*data.level*100) / (data.next-data.level*data.level*100)*100);
                                    var lvInterval = $interval(function(){
                                        // if(!$scope.isCounting) $scope.isCounting = true;
                                        $scope.data.exp += 5;
                                        if($scope.data.exp > $scope.data.next){
                                            $scope.data.level = res.data.level;
                                            $scope.data.next = res.data.next;
                                        }
                                        // console.log(data.exp);
                                        // $scope.percent = parseInt((data.exp - data.level*data.level*100) / (data.next-data.level*data.level*100)*100);
                                        if($scope.data.exp >= res.data.exp){
                                            $interval.cancel(lvInterval);
                                            $scope.data = res.data;
                                            $timeout(function(){
                                                $mdDialog.cancel();
                                            },2000);
                                        }
                                    }, 100, 0, true);
                                }],
                                autoWrap: false,
                                bindToController: true,
                                locals: {data: $rootScope.user},
                                templateUrl: 'app/templates/levelDialog.tmpl.html',
                                parent: angular.element(document.body),
                                clickOutsideToClose:true
                            })
                            .then(function(answer) {

                            }, function() {

                            });
                    };

                    // if(res.data.level > $rootScope.user.level){
                    //     var toast3 = $mdToast.simple()
                    //         .textContent('Chúc mừng! Bạn đã được thăng cấp')
                    //         .theme('md-accent')
                    //         .position('bottom left');
                    //     $mdToast.show(toast3).then(function(response) {
                    //         //callback
                    //     });
                    // }
                    $rootScope.user = res.data;
                });
            }
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
        $scope.onCreateRoom = function(ev){
            if($rootScope.user){
                if(!localStorage.getItem('helpCreate')){
                    $mdDialog.show({
                            controller: ['$scope', '$mdDialog', 'callCreate',function($scope, $mdDialog, callCreate) {
                                $scope.cancel = function() {
                                    try
                                    {
                                        localStorage.setItem('helpCreate',true);
                                    }
                                    catch (error)
                                    {
                                        return false;
                                    }
                                    $mdDialog.cancel();
                                    callCreate();
                                };
                                $scope.slides = [
                                    '/img/tutorroom1.png',
                                    '/img/tutorroom2.png',
                                    '/img/tutorroom3.png',
                                    '/img/tutorroom4.png'
                                ]
                            }],
                            autoWrap: false,
                            templateUrl: 'app/templates/helpDialog.tmpl.html',
                            locals: {callCreate: $scope.callCreate},
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose:true
                        })
                        .then(function() {

                        }, function() {

                        });
                } else {
                    $scope.callCreate();
                }
            }


        };
        $scope.callCreate = function(){
            $scope.isEnd = false;
            $scope.isPlay = false;
            if(!$scope.isBattle){
                $scope.isBattle = true;
                $('body').css('overflow','hidden');
                $scope.battle = BattleService;
                $scope.battle.init($scope.games.currentGame,$rootScope.user,null);
            };
            $scope.battle.onCreateRoom(function(){
            });
        }
        $scope.statusClass = function(status){
            return 'status-' + status;
        }
        $scope.onBattleCall = function (ev) {
            if($rootScope.user){
                if(!localStorage.getItem('helpFind')){
                    $mdDialog.show({
                            controller: ['$scope', '$mdDialog', 'callFind',function($scope, $mdDialog, callFind) {
                                $scope.cancel = function() {
                                    try
                                    {
                                        localStorage.setItem('helpFind',true);
                                    }
                                    catch (error)
                                    {
                                        return false;
                                    }
                                    $mdDialog.cancel();
                                    callFind();
                                };
                                $scope.slides = [
                                    '/img/tutorfind1.png',
                                    '/img/tutorfind2.png',
                                    '/img/tutorfind3.png',
                                    '/img/tutorfind4.png'
                                ]
                            }],
                            autoWrap: false,
                            templateUrl: 'app/templates/helpDialog.tmpl.html',
                            locals: {callFind: $scope.callFind},
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose:true
                        })
                        .then(function() {

                        }, function() {

                        });
                } else {
                    $scope.callFind();
                }
            }


        };
        $scope.callFind = function(){
            $scope.isBattle = true;
            $('body').css('overflow','hidden');
            $scope.battle = BattleService;
            $scope.battle.init($scope.games.currentGame,$rootScope.user,null);
            $scope.battle.onFindBattle(null,function(){
                $scope.onError();
            });
        };
        $scope.onError = function(){
            $scope.isBattle = false;
            $('body').css('overflow','auto');
        };
        $scope.onCloseBattle = function(){
            var confirm = $mdDialog.confirm()
                .title('Thoát chế độ thách đấu')
                .textContent('Bạn chắc chắn muốn thoát chứ?')
                .parent(angular.element(document.body))
                .ok('Có')
                .cancel('Không');
            // if($scope.battle.status.isEndGame){
            //     confirm.parent(angular.element(document.querySelector('.recommend-games')))
            // } else if($scope.battle.status.isFullscreen){
            //     confirm.parent(angular.element(document.querySelector('.game-area')))
            // } else if($scope.battle.status.isWaitRoom){
            //     confirm.parent(angular.element(document.querySelector('.battle-room')));
            // } else {
            //     confirm.parent(angular.element(document.querySelector('.spinner-bg')));
            // }
            $mdDialog.show(confirm).then(function() {
                $scope.isBattle = false;
                $('body').css('overflow','auto');
                $location.search().roomId = null;
                //chuyen phase game ve chon choi
                $scope.isPlay = false;
                $scope.isEnd = false;
                $scope.battle.onCloseBattle();
            }, function() {

            });

        }
        $scope.isMobile = function(){
            if($(window).width() >= 960){
                return false;
            } else {
                return true;
            }
        }

    }]);
angular.module('funstart').directive('fsImg', ['$routeParams',function($routeParams) {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr)
        {
            var s = document.createElement("img");
            var src = elem.attr('src');
            if(src!==undefined)
            {
                s.src = '/sources/game/' + $routeParams.gameId + src;
                if(s.class) s.class = elem.attr('class');
                if(s.style) s.style = elem.attr('style');
                if(s.id) s.id = elem.attr('id');
            }
            else
            {
                var code = elem.text();
                s.text = code;
            }
            elem.parent().append(s);
            elem.remove();
        }
    };
}]);

angular.module('funstart').directive('fsScript', ['$routeParams',function($routeParams) {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr)
        {

            var s = document.createElement("script");
            s.type = "text/javascript";
            var src = elem.attr('src');
            if(src!==undefined)
            {
                s.src = '/sources/game/' + $routeParams.gameId + src;
            }
            else
            {
                var code = elem.text();
                s.text = code;
            }
            document.head.appendChild(s);
            elem.remove();

        }
    };
}]);
// angular.module('funstart').directive('ng-game', function() {
//     return {
//         restrict: 'E',
//         scope: false,
//         link: function(scope, elem, attr)
//         {
//             elem.html();
//         }
//     };
// });

angular.module('funstart').directive('fsLink', ['$routeParams',function($routeParams) {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr)
        {
            var s = document.createElement("link");
            s.type = "text/css";
            s.rel = "stylesheet";
            var href = elem.attr('href');
            if(href!==undefined)
            {
                s.href = '/sources/game/' + $routeParams.gameId + href;
            }
            else
            {
                var code = elem.text();
                s.text = code;
            }
            document.head.appendChild(s);
            elem.remove();
        }
    };
}]);