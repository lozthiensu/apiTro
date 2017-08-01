
/**
 * Created by lethanhtung on 8/11/16.
 */
angular.module('funstart').factory('Activities', ['$resource',
    function($resource) {
        return $resource('api/activities');
    }
]);
angular.module('funstart').service('ActivitiesService',['Activities',function(Activities){
    var self = {
        'user': null,
        'game': null,
        'isLoading': false,
        'hasMore': true,
        'page': 1,
        'data': [],
        "createActivity": function (obj,callback) {
            var activity = new Activities(obj);
            activity.$save(function(res){
                if(callback) callback(res);
            },function(err){
                
            });
        },
        "init": function(user,game){
            self.data = [];
            self.user = user || null;
            self.game = game || null;
            self.page = 1;
            self.hasMore = true;
            self.isLoading = false;
        },
        "loadMore": function(){
            self.page++;
            self.loadActivities();
        },
        "loadActivities": function(){
            if(!self.isLoading && self.hasMore){
                self.isLoading = true;
                var params = {
                    page: self.page
                };
                if(self.game) params.game = self.game;
                if(self.user) params.user = self.user;
                Activities.get(params,function(res){
                    angular.forEach(res.data,function(activity){
                        self.data.push(new Activities(activity));
                    });

                    if(!res.isNext){
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });
            }

        }
    };
    return self;
    
}]);