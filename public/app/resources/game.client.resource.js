/**
 * Created by andh on 7/28/16.
 */
angular.module('funstart').factory('Games', ['$resource',
    function($resource) {
        return $resource('api/games/:gameId', {
            gameId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
angular.module('funstart').factory('Topics',['$resource',
    function($resource){
        return $resource('api/topics')
    }])
angular.module('funstart').service('IndexService', ['Games',function (Games) {
    var self = {
        'topic': null,
        'isLoading': false,
        'isLoadingTopic': false,
        'data': {},
        'paging': 8,
        'initData': function(field){
            self.topic = null;
            self.data[field]= [];
        },
        'loadGames': function (callback) {

            var params = {
                'page': self.page,
                'sort': 'created',
                'paging': self.paging
            };
            if(self.topic!=null) {
                params.topic = self.topic;
                self.isLoadingTopic = true;
            } else {
                self.isLoading = true;
            }
            Games.get(params, function (res) {
                if(self.topic!=null){
                    angular.forEach(res.data, function (game) {
                        if(!self.data.topic[game.topic._id]) self.data.topic[game.topic._id] = [];
                        self.data.topic[game.topic._id].push(new Games(game));
                    });
                    self.isLoadingTopic = false;
                    if(callback) callback();
                } else {
                    angular.forEach(res.data, function (game) {
                        self.data.new.push(new Games(game));
                    });
                    self.isLoading = false;
                    if(callback) callback();
                }

            });
            if(self.topic != null) self.topic++;
        }

    };
    return self;
}]);
angular.module('funstart').service('NavGamesService', ['Games',function (Games) {
    var self = {
        'text': null,
        'isLoading': false,
        'data': [],
        'paging': 5,
        'searchGames': function(callback){
            var params = {
                'page': self.page,
                'order': 'created',
                'text': self.text
            };
            Games.get(params, function (res) {
                callback(res.data);
            });
        },
        'loadRandomGames': function () {
            if (!self.isLoading) {
                self.isLoading = true;
                var params = {
                    'page': self.page,
                    'order': 'random',
                    'paging': self.paging
                };
                Games.get(params, function (res) {
                    angular.forEach(res.data, function (game) {
                        self.data.push(new Games(game));
                    });
                    self.isLoading = false;
                });
            }
        }

    };
    return self;
}]);
angular.module('funstart').service('GamesService', ['Games',function (Games) {
    var self = {
        'page': 1,
        'hasMore': true,
        'topic': null,
        'isLoading': false,
        'currentGame': null,
        'data': [],
        'order': 'created',
        'paging': 12,
        'reload': function () {
            self.hasMore = true;
            self.page = 1;
            self.data = [];
            self.loadGames();
        },
        'loadGame': function(gameId,callback){
            if(!self.isLoading){
                self.isLoading = true;
                var params = {
                    'gameId': gameId
                };
                Games.get(params, function (res) {
                    self.currentGame = res.data;
                    self.isLoading = false;
                    if(callback) callback();
                });
            }

        },
        'loadGames': function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;
                var params = {
                    'page': self.page,
                    'order': self.order,
                    'paging': self.paging
                };
                if(self.topic!=null) {
                    params.topic = self.topic;
                };
                Games.get(params, function (res) {
                    angular.forEach(res.data, function (game) {
                        self.data.push(new Games(game));
                    });
                    if (!res.isNext) {
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });

            }
        },
        'loadMore': function () {
            if (self.hasMore && !self.isLoading) {
                self.page += 1;
                self.loadGames();
            }
        }

    };
    return self;
}]);