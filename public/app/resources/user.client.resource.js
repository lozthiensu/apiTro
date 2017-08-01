/**
 * Created by andh on 8/12/16.
 */
angular.module('funstart').factory('Users', ['$resource',
    function($resource) {
        return $resource('api/users/:username', {
            username: '@username'
        },{
            'update': {method:'PUT'}
        });
    }
]);

angular.module('funstart').service('UserInfoService',['Users',function(Users){
    var self = {
        'isLoading': false,
        'data': {},
        'loadUser': function (username,callback) {
            if (!self.isLoading) {
                console.log('vo load user');
                self.isLoading = true;
                var params = {
                    username: username
                };
                Users.get(params,function (res) {
                    self.data = new Users(res.data);
                    if(callback) callback();
                    self.isLoading = false;
                });

            }
        },
        'follow': function(callback){
            var params = {
                action: 'follow'
            };
            self.data.$update(params,function(res){
                console.log('update follow status');
                self.data.isFriend = true;
                if(callback) callback();
            });
        },
        'unfollow': function(callback){

            var params = {
                action: 'unfollow'

            };
            self.data.$update(params,function(res){
                console.log('update unfollow status');
                self.data.isFriend = false;
                if(callback) callback();
            });
        }
    };
    return self;

}]);


angular.module('funstart').service('ShortInfoService',['Users',function(Users){
    var self = {
        'isLoading': false,
        'isFollowing': false,
        'data': {},
        'loadUser': function (username,user,callback) {
            if (!self.isLoading) {
                self.isLoading = true;
                var params = {
                    username: username,
                    short: true
                };
                Users.get(params,function (res) {
                    self.data = new Users(res.data);
                    self.data.friends.forEach(function(e){
                        if(e == user._id){
                            self.data.isFriend = true;
                            return true;
                        }
                    })
                    self.isLoading = false;
                    if(callback) callback();

                });

            }
        },
        'follow': function(callback){
            var params = {
                action: 'follow'
            };
            self.isFollowing = true;
            self.data.$update(params,function(res){
                console.log('update follow status');
                self.data.isFriend = true;
                self.isFollowing = false;
                if(callback) callback();
            });
        }
    };
    return self;

}]);

angular.module('funstart').service('FriendsService',['Users',function(Users){
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
                    order: self.order
                };
                Users.get(params,function (res) {
                    angular.forEach(res.data,function(user){
                        self.data.push(new Users(user));

                    });
                    self.isLoading = false;
                    if(!res.isNext){
                        self.hasMore = false;
                    }
                    self.page ++;
                    if(callback) callback();
                });
            }
        }
    };
    return self;

}]);

angular.module('funstart').service('SuggestService',['Users',function(Users){
    var self = {
        'isLoading': false,
        'hasMore': true,
        'data' : [],
        'order' : 'exp',
        'suggest' : 'facebook',
        'page' : 1,
        'init' :  function(){
            self.isLoading = false;
            self.hasMore = true;
            self.page = 1;
            self.data = [];
            self.order = 'exp';
        },
        'follow': function(obj,callback){
            var params = {
                action: 'follow'
            };
            obj.$update(params,function(res){
                obj.isFriend = true;
                console.log('chay callback follow');
                console.log(callback);
                if(callback) callback(true,obj);
            });
        },
        'unfollow': function(obj,callback){
            var params = {
                action: 'unfollow'
            };
            obj.$update(params,function(res){
                obj.isFriend = false;
                if(callback) callback(false,obj);
            });
        },
        'loadMore' : function () {
            self.loadSuggest();
        },
        'loadSuggest': function (callback) {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;
                var params = {
                    suggest: self.suggest,
                    page: self.page,
                    order: self.order
                };
                Users.get(params,function (res) {
                    angular.forEach(res.data,function(user){
                        user.isFriend = false;
                        self.data.push(new Users(user));

                    })
                    self.isLoading = false;
                    if(!res.isNext){
                        self.hasMore = false;
                    }
                    self.page ++;
                    if(callback) callback();
                });
            }
        }
    };
    return self;

}]);