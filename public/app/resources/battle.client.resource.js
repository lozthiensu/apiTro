angular.module('funstart').factory('Rooms', ['$resource',
    function($resource) {
        return $resource('api/battle/:roomId', {
            roomId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
angular.module('funstart').factory('Invite', ['$resource',
    function($resource) {
        return $resource('api/invite/:roomId', {
            roomId: '@roomId'
        });
    }
]);
angular.module('funstart').service('FriendsOnlineService',['Users',function(Users){
    var self = {
        'isLoading': false,
        'hasMore': true,
        'data' : [],
        'order' : 'exp',
        'page' : 1,
        'userId': null,
        'init' :  function(){
            self.isLoading = false;
            self.hasMore = true;
            self.page = 1;
            self.data = [];
            self.order = 'exp';
        },
        'loadMore' : function () {
            self.loadFriends();
        },
        'loadFriends': function (callback) {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;
                var params = {
                    friend: self.userId,
                    page: self.page,
                    order: self.order,
                    online: true
                };
                Users.get(params,function (res) {
                    angular.forEach(res.data,function(user){
                        self.data.push(new Users(user));

                    });
                    self.isLoading = false;
                    if(!res.isNext){
                        self.hasMore = false;
                    }
                    self.page++;
                    if(callback) callback();
                });
            }
        }
    };
    return self;

}]);
angular.module('funstart').service('BattleService',['$rootScope','$timeout','Rooms','Invite','$mdDialog','FriendsOnlineService','Users','FriendsService','$mdToast','$location',
    function ($rootScope,$timeout,Rooms,Invite,$mdDialog,FriendsOnlineService,Users,FriendsService,$mdToast,$location) {
    var self = this;
    self.chat  = {};
    self.status = {};
    self.friends = {};
    self.opponent = {};
    self.friends = {};
    self.messages = [];
    self.isHost = true;
    self.init = function(game,user,roomId,error){
        self.isHost = true;
        self.isReady = false;
        self.game = game;
        self.room = null;
        self.user = user;
        self.chat = {
            avatar: self.user.avatar,
            isChat: false,
            message: "",
            isNew: false
        };
        self.players = [];
        self.opponent = {};
        self.status = {
            isSearching: false,
            isFullRoom: false,
            isReady: false,
            isIntro: false,
            isFullscreen: false,
            isEndGame: false,
            isWaitRoom: false
        };
        if(roomId) {
            self.isHost = false;
            self.joinRoom(roomId,function(){
                self.friends = FriendsOnlineService;
                self.friends.userId = self.user._id;
                self.friends.loadFriends();
            }, function(message){
                var alert = $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('THÔNG BÁO!')
                    .ok('Okie!');
                if(message == 'FULL'){
                    alert.textContent('Rất tiếc, phòng đã đầy')
                } else if(message == 'NULL'){
                    alert.textContent('Phòng không tồn tại');
                } else if(message == 'PLAYED'){
                    alert.textContent('Phòng đã bắt đầu');
                } else {
                    alert.textContent('Có lỗi. Vui lòng thử lại sau');
                }
                self.isLoading = false;
                $mdDialog.show(alert).then(function() {
                    self.status = {};
                    if(error) error();
                }, function() {
                });
                self.onCloseBattle();
            });
        }
        $(document).bind('touchmove','#chat-btn', function() {
            if($(event.target).parent() && $(event.target).parent().attr("id")=="chat-btn"){
                //Assume only one touch/only process one touch even if there's more
                var touch = event.targetTouches[0];
                if(touch.pageY>0 && touch.pageX>0 && touch.pageY<$(window).height() && touch.pageX < $(window).width()){
                    $('#chat-btn').offset({top: touch.pageY - 25,left : touch.pageX - 25});
                }
                event.preventDefault();
            };

        }, false);
    }
    self.onCloseBattle = function(){
        //ket thuc man dau
        self.status = {};
        if(self.room) {
            self.room.$remove(function(res){
                self.room = null;
            },function (err) {
                
            });
        }
    };
    self.checkRoomFull = function(bool){
        if(self.room.members.length >= self.game.min){
            self.status.isSearching = false;
            if(self.room.status==0) {
                $timeout.cancel(self.listenSearchLong);
                self.status.isFullRoom = true;
            }
            if(bool) $rootScope.$apply();
        }
    }
    self.checkRoomReady = function(start){
        if(self.room && self.room.ready.length >= self.room.members.length){
            console.log('ready roi ne');
            self.status.isReady = false;
            if(self.room.status == 0  || self.room.status == 3) {
                self.room.members.forEach(function(e){
                    if(e._id != self.user._id){
                        self.opponent = e;
                        return true;
                    }
                });
                self.players = self.room.members;
                self.onBattle(start);
            }
        }
    };
    self.updateReady = function(start){
        Rooms.update({_id: self.room._id, ready: true});
        self.room.ready.push(self.user._id);
        socket.off('ready');
        socket.on('ready',function(data){
            self.room.ready = data;
            var tmp = [];
            self.room.members.forEach(function(player){
                data.forEach(function(e){
                    if(player._id == e){
                        player.isReady = true;
                        return true;
                    }
                });
                tmp.push(player);
            })
            self.room.members = tmp;
            self.checkRoomReady(start);
            $rootScope.$apply();
        });
    };
    self.listenSearch = function(error){
        return $timeout(function(){
            if(self.status.isSearching){
                var alert = $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .textContent('Hiện không có người tìm đối thủ, vui lòng chơi game hoặc tạo phòng rồi mời bạn nhé!')
                    .clickOutsideToClose(true)
                    .title('THÔNG BÁO!')
                    .ok('Okie!');
                $mdDialog.show(alert).then(function() {
                    self.status = {};
                    if(error) error();
                }, function() {
                });
                self.onCloseBattle();
            }
        },20000);
    };
    self.listenReady = function(error){
        return $timeout(function(){
            if(self.status.isReady){
                var alert = $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .textContent('Có người chơi chưa nhấn sẵn sàng, vui lòng tìm kiếm lại')
                    .clickOutsideToClose(true)
                    .title('THÔNG BÁO!')
                    .ok('Okie!');
                $mdDialog.show(alert).then(function() {
                    self.status = {};
                    self.onCloseBattle();
                    if(error) error();
                }, function() {
                });

            }
        },10000);
    };
    self.onFindBattle = function(success,error){
        self.offSocket();
        $location.search({});
        self.status.isSearching = true;
        self.listenSearchLong = self.listenSearch(error);
        Rooms.get({gameId: self.game._id},function(res){
            if(res.data == null){
                self.createRoom("find");
            } else {
                self.isHost = false;
                self.room = new Rooms(res.data);
                self.messages = [];
                self.listenMessage();
                self.checkRoomFull(false);
                self.listenRoom();
            };
        },function(err){
            //xu ly loi
        })
    };
    self.updatePlayers = function(){
        // var tmp = [];
        Object.keys(self.room.players).forEach(function(e){
            self.players.forEach(function(player){
                if(player._id == e){
                    player.score = self.room.players[e].score;
                    player.isDead = self.room.players[e].isDead;
                    player.isWin = self.room.players[e].isWin;
                    player.turn = self.room.players[e].turn;
                    // tmp.push(player);
                    return true;
                }
            })
        });
        // self.room.players = tmp;
    }
    self.kickMember = function(user){
        // console.log('vo kick',user);
        if(self.room) Rooms.update({_id: self.room._id, kick: user._id},function(res){
        },function(err){
        });
    };
    self.joinRoom = function(roomId,success,error){
        self.offSocket();
        Rooms.get({roomId: roomId},function(res){
            self.room = new Rooms(res.data);
            self.messages = [];
            self.listenMessage();
            self.checkFriend();
            self.isLoading = false;
            self.status.isWaitRoom = true;
            self.handlingRoom();
            if(success) success();
        },function(err){
            if(error) error(err.data.message);
        })

    };
    self.createRoom = function(mode,callback){
        Rooms.save({gameId: self.game._id, mode: mode},function (res) {
            self.room = new Rooms(res.data);
            // q = '?' + window.location.href.split('?')[1] + '&roomdId=' + self.room._id;
            // $location.search({});
            // location.search = ()
            self.messages = [];
            self.listenMessage();
            self.room.members = [{
                _id: self.user._id,
                username: self.user.username,
                displayName: self.user.displayName,
                avatar: self.user.avatar,
                class: self.user.class
            }];
            if(self.room.mode=="room"){
                self.handlingRoom();
            } else{
                self.listenRoom();

            }
            if(callback) callback(res.data._id);
        },function(err){

        });
    };
    self.listenRoom = function () {
        socket.on('join',function(data){
            if(self.room) {
                self.room.members = data;
                self.room.people = self.room.members.length;
                if(self.room.mode = "find") self.checkRoomFull(true);

            }
        });
        socket.on('leave',function(data){
            if(self.room && self.room.mode == "find" && self.room.status == 0){
                var alert = $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .textContent('Có người chơi vừa rời phòng, hệ thống đang tìm kiếm lại')
                    .clickOutsideToClose(true)
                    .title('THÔNG BÁO!')
                    .ok('Okie!');
                $mdDialog.show(alert).then(function() {
                }, function() {
                });
                self.room.people = data.members.length;
                self.status.isFullRoom = false;
                self.status.isReady = false;
                self.status.isSearching = true;
                $rootScope.$apply();
            }
        });
    };
    self.checkFriend = function(){
        self.room.members.forEach(function(e){
            var check = false;
            $rootScope.user.friends.forEach(function(friend){
                if(friend == e._id){
                    check = true;
                    return true;
                }
            })
            if(check){
                e.isFriend = true;
            } else {
                e.isFriend = false;
            }
        });
    };
    self.handlingRoom = function(){
        socket.on('join',function(data){
            self.room.members = data;
            self.checkFriend();
            self.room.people = self.room.members.length;
            var toastJoin = $mdToast.simple()
                .theme('md-accent')
                .textContent('Có người chơi vừa tham gia phòng')
                .position('center center');
            $mdToast.show(toastJoin).then(function(response) {
                //callback
            });
            $rootScope.$apply();
        });
        socket.on('leave',function(data){
            console.log('leave');
            // console.log('leave',data);
            if(self.room){
                var toastJoin = $mdToast.simple()
                    .theme('md-accent')
                    .textContent('Có người chơi vừa thoát phòng')
                    .position('center center');
                $mdToast.show(toastJoin).then(function(response) {
                    //callback
                });
                self.room.members = self.room.members.filter(function(item){
                    var check = false;
                    data.members.forEach(function(e){
                        if(e == item._id){
                            check = true;
                            return true;
                        }
                    })
                    return check;
                });
                var kick = true;
                self.room.members.forEach(function(item){
                    if(item._id == $rootScope.user._id){
                        kick = false;
                        return true;
                    }
                });
                if(data.turn == self.user._id) {
                    self.isHost = true;
                    self.room.link = window.location.href.split("?")[0] + '?roomId=' + self.room._id;
                }
                // console.log(self.room.members);
                if (kick == true){
                    $mdDialog.show({
                            controller: ['$scope', '$mdDialog','$location',function($scope, $mdDialog,$location) {
                                $scope.hide = function() {
                                    $location.search({});
                                    window.location.reload();
                                    $mdDialog.cancel();
                                };
                                $scope.cancel = function() {
                                    $location.search({});
                                    window.location.reload();
                                    $mdDialog.cancel();
                                };
                                $scope.goHome = function(){
                                    $location.search({});
                                    window.location.reload();
                                    $mdDialog.cancel();
                                }
                            }],
                            templateUrl: 'app/templates/kickDialog.tmpl.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose:false
                        })
                        .then(function(answer) {

                        }, function() {

                        });
                }
                self.room.people = self.room.members.length;
                self.isReady = false;
                $rootScope.$apply();
            }
        });
        socket.on('ready',function(data){
            self.room.ready = data;
            var tmp = [];
            self.room.members.forEach(function(player){
                player.isReady = false;
                data.forEach(function(e){
                    if(player._id == e){
                        player.isReady = true;
                        return true;
                    }
                });
                tmp.push(player);
            })
            self.room.members = tmp;
            $rootScope.$apply();
        });
    }
    self.onReady = function(start,error){
        console.log(self.room.mode);
        //tat san sang
        if(self.room.mode == "find"){
            self.status.isFullRoom = false;
            self.status.isReady = true;
            self.listenReadyLong = self.listenReady(error);
            self.isReady = true;
            self.updateReady(start);
        } else if(self.room.mode == "room"){
            if(self.room.members.length >= self.game.min){
                self.isReady = true;
                self.updateReady(start);
            } else {
                var alert = $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .textContent('Phải đủ '+ self.game.min + ' người mới có thể bắt đầu phòng chơi. Mời thêm bạn nhé!')
                    .clickOutsideToClose(true)
                    .title('THÔNG BÁO!')
                    .ok('Okie!');
                $mdDialog.show(alert).then(function() {
                }, function() {
                });
            }

        }

    };
    self.onBattle = function(callback){

        self.status.isWaitRoom = false;
        //tat san sang
        self.status.isReady = false;
        //bat bat dau choi
        self.status.isIntro = true;
        self.room.status = 1;
        console.log('start');
        Rooms.update({_id: self.room._id,status: true});

        socket.on('players',function (players) {
            self.room.players = players;
            self.updatePlayers();
            $rootScope.$apply();
        });
        socket.off('leave');
        socket.on('leave',function(id){
            self.players.forEach(function(e){
                if(e._id == id) e.connect = 0;
                $rootScope.$apply();
            })
        });

        // self.handleResultDialog();
        setTimeout(function () {
            //mo man choi
            //mo class battle
            self.status.isFullscreen = true;
            $rootScope.$apply(function () {
                if(callback) callback();
            });
            //bat dau game
        },6000)
    };
    self.orderPlayer = function(item){
        if(self.game.type==0){
            return -item.score;
        } else if(self.game.type==1){
            return item.turn;
        } else {
            return item.displayName;
        }
    };
    self.invite = function (user) {
        if(self.room) Invite.save({roomId: self.room._id,player: user._id},function(res){
            user.isInvited = true;
        },function (err) {
        });
    };
    self.follow = function(item,callback){
        var params = {
            action: 'follow'
        };
        var tmpUser = new Users(item);
        tmpUser.$update(params,function(res){
            if(callback) callback();
        });
    };
    self.unfollow = function(item,callback){
        var params = {
            action: 'unfollow'
        };
        var tmpUser = new Users(item);
        tmpUser.$update(params,function(res){
            if(callback) callback();
        });
    };
    self.updateList = function(bool,item){
        if(bool){
            item.isFriend = true;
            $rootScope.user.friends.push(item._id);
        } else {
            item.isFriend = false;
            $rootScope.user.friends.splice($rootScope.user.friends.indexOf(item._id),1);
        }
    }
    self.refreshList = function(bool,item){
        if(bool){
            item.isFriend = true;
            $rootScope.user.friends.push(item._id);
        } else {
            item.isFriend = false;
            $rootScope.user.friends.splice($rootScope.user.friends.indexOf(item._id),1);
        }
        self.refreshListInvite();
    }
    self.onWaitRoom = function(error){
        self.status = {
            isSearching: false,
            isFullRoom: false,
            isReady: false,
            isIntro: false,
            isFullscreen: false,
            isEndGame: false,
            isWaitRoom: true
        };
        self.room.mode = 'room';
        self.offSocket();
        self.handlingRoom();
        $location.search({roomId: self.room._id});
        self.room.link = window.location.href.split("?")[0] + '?roomId=' + self.room._id;
        if(self.room) Rooms.update({_id: self.room._id, again: true},function(res){
            self.isReady = false;
            self.room.status = 3;
            if(res.data.length == 1){
                self.room.members = [{
                    _id: self.user._id,
                    username: self.user.username,
                    displayName: self.user.displayName,
                    avatar: self.user.avatar
                }];
            } else {
                self.room.members = res.data;
            }
        },function(err){

        });
        // if(self.room){
        //     console.log(self.room);
        //     // var players = [];
        //     // self.players.forEach(function(player){
        //     //     if(player._id != self.user._id) players.push(player._id);
        //     // });
        //     var tmpRoom = self.room;
        //     self.room.$remove(function(){
        //         self.isReady = false;
        //         self.room = null;
        //         self.opponent = {};
        //         self.status = {
        //             isSearching: false,
        //             isFullRoom: false,
        //             isReady: false,
        //             isIntro: false,
        //             isFullscreen: false,
        //             isEndGame: false,
        //             isWaitRoom: true
        //         };
        //         if(self.waitRoom){
        //             self.friends = FriendsOnlineService;
        //             self.friends.userId = self.user._id;
        //             self.friends.loadFriends();
        //             console.log('wait room',self.waitRoom);
        //             self.isHost = false;
        //             self.joinRoom(self.waitRoom,function(){
        //             },function(message){
        //                 var alert = $mdDialog.alert()
        //                     .parent(angular.element(document.body))
        //                     .clickOutsideToClose(true)
        //                     .title('THÔNG BÁO!')
        //                     .ok('Okie!');
        //                 if(message == 'FULL'){
        //                     alert.textContent('Rất tiếc, phòng đã đầy')
        //                 } else if(message == 'NULL'){
        //                     alert.textContent('Phòng không tồn tại');
        //                 } else if(message == 'PLAYED'){
        //                     alert.textContent('Phòng đã bắt đầu');
        //                 } else {
        //                     alert.textContent('Có lỗi. Vui lòng thử lại sau');
        //                 }
        //                 self.isLoading = false;
        //                 $mdDialog.show(alert).then(function() {
        //                     self.status = {};
        //                     if(error) error();
        //                 }, function() {
        //                 });
        //                 self.onCloseBattle();
        //             });
        //             self.waitRoom = null;
        //         } else {
        //             console.log('create room cho');
        //             self.isHost = true;
        //             self.createRoom("room",function(key){
        //                 console.log(self.room);
        //                 Invite.save({roomId: key, room: tmpRoom._id});
        //                 self.room.link = window.location.href.split("?")[0] + '?roomId=' + key;
        //             });
        //         }
        //     });

        // }


    }
    self.offSocket = function(){
        socket.off('ready');
        socket.off('join');
        socket.off('leave');
        socket.off('again');
        socket.off('chatRoom');
    }
    self.onCreateRoom = function(){
        self.offSocket();
        self.isHost = true;
        self.friends = FriendsOnlineService;
        self.friends.userId = self.user._id;
        self.friends.loadFriends();
        self.status.isWaitRoom = true;
        self.createRoom("room",function(key){
            self.isReady = false;
            $location.search({roomId: key});
            self.room.link = window.location.href.split("?")[0] + '?roomId=' + key;
        });
        // var toastBattleAgain = $mdToast.simple()
        //     .textContent('Lời mời đã được gửi đi')
        //     .position('center center');
        // $mdToast.show(toastBattleAgain).then(function(response) {
        //     //callback
        // });
        // 1. Gui list user vua choi ve 1 API
        // 2. Tren server nhan list user va them vao database muc invite
        // 3. Khi co nguoi thay doi status la 1, gui thong bao ve tat ca cac nguoi choi thong qua child change
        // 4. Chi host moi co quyen thay doi status game sang 1. Khi do server se lang nghe va xoa het tat ca nguoi choi co status 0
    }
    self.refreshListInvite = function(){
        self.friends = FriendsOnlineService;
        self.friends.init();
        self.friends.userId = self.user._id;
        self.friends.loadFriends(function(){
            self.filterFriendInRoom();
        });
    };
    self.refreshListInviteMore = function(){
        self.friends.loadMore(function () {
            self.filterFriendInRoom();
        });
    };
    self.filterFriendInRoom = function(){
        if(self.room && self.room.members){
            self.friends.data = self.friends.data.filter(function (item) {
                var check = false;
                self.room.members.forEach(function (player) {
                    if(item._id != player._id){
                        check = true;
                        return true;
                    }
                })
                return check;
            });
            // console.log(self.friends.data);
        }
    }
    self.updateObj = function(obj,prepare,callback){
        if(self.room) Rooms.update({_id: self.room._id, obj: obj, prepare: prepare},function(res){
            if(callback) callback();
        },function(err){

        });
    };
    self.updateData = function(data,callback){
        if(self.room) Rooms.update({_id: self.room._id, data: data},function(res){
            if(callback) callback();
        },function(err){

        });
    };
    self.onSendMessage = function(){
        socket.emit('chatRoom',{roomId: self.room._id, message: self.chat.message, userId:self.user._id});
        self.chat.message = '';
        // Message.save({_id: self.room._id,message: self.message},function(){
        //     self.message = '';
        // });
    };
    self.onViewChat = function(){
        self.chat.isNew = false;
        self.chat.isChat = true;
    }
    self.listenMessage = function(){
        socket.on('chatRoom',function (data) {
           if(data.id == self.user._id){
               self.messages.push({
                   displayName: self.user.displayName,
                   avatar: self.user.avatar,
                   message: data.message,
                   type: 0
               });
               self.chat.avatar = self.user.avatar;
           } else {
               self.chat.isNew = true;
               self.room.members.forEach(function(member){
                   if(data.id == member._id){
                       self.messages.push({
                           displayName: member.displayName,
                           avatar: member.avatar,
                           message: data.message,
                           type: 1
                       });
                       self.chat.avatar = member.avatar;
                       return true;
                   }
               });

           }
            setTimeout(function(){
                var objDiv = document.getElementById("scroll-bottom-2");
                objDiv.scrollTop = objDiv.scrollHeight;
            },100);
            $rootScope.$apply();
        });
    }
    self.handleResultDialog = function(){
        socket.on("end",function(stt){
            var win = null;
            Object.keys(stt).forEach(function(e){
                if(e == self.user._id){
                   win = stt[e];
                }
            });
            if(win){
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('.recommend-games')))
                        .clickOutsideToClose(true)
                        .title('CHÚC MỪNG!')
                        .textContent('Bạn đã chiến thắng!')
                        .ok('Okie!')
                );
            } else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('.recommend-games')))
                        .clickOutsideToClose(true)
                        .title('CHIA BUỒN!')
                        .textContent('Bạn thua cmnr!')
                        .ok('Okie!')
                );
            }
        })

    };
    self.onDead = function(bool){
        self.status.isEndGame = true;
        if(bool!=null){
            Rooms.update({_id: self.room._id, obj: {isWin: bool, isDead: true}});
        } else {
            Rooms.update({_id: self.room._id, obj: {isDead: true}});
        }
    }
}]);