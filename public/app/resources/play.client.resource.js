/**
 * Created by andh on 8/16/16.
 */

angular.module('funstart').service('ShareService',function(){
    var self = {
        'isShared': false,
        'url': window.location.href.split("?")[0],
        'pic': null,
        'name': null,
        'des': null,
        'setInfo': function(obj){
            if(obj.url) self.url = obj.url;
            if(obj.pic) self.pic = obj.pic;
            if(obj.name) self.name = obj.name;
            if(obj.des) self.des = obj.des;
        },
        'shareFacebook': function(obj,callback){
            FB.ui({
                method: 'share',
                mobile_iframe: true,
                href: self.url + "?ref=share&rs_image="+self.pic+"&rs_title="+self.name+"&rs_des="+self.des
            }, function(res){
                if (callback) callback();
            });


        }

    };
    return self;

});
angular.module('funstart').factory('Shooting', ['$resource',
    function($resource) {
        return $resource('api/shooting/:gameId', {
            gameId: '@_id'
        });
    }
]);
angular.module('funstart').factory('Tracking', ['$resource',
    function($resource) {
        return $resource('api/tracking', {
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
angular.module('funstart').service('TrackingService',['Tracking',function(Tracking){
    var self = {
        'source': null,
        'game': null,
        'init': function(source,game){
            self.source = source;
            self.game = game;
        },
        'track' : function () {
            Tracking.update({source: self.source, game: self.game});
        }
    }
    return self;
}]);
