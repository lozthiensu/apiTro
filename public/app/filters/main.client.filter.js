/**
 * Created by andh on 8/30/16.
 */
angular.module('funstart').filter('trustAsHTML', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
angular.module('funstart').filter('timeAgo', function(){
    return function(date) {
        var seconds = Math.floor((Date.now() - new Date(date)) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval + " năm trước";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + " tháng trước";
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + " ngày trước";
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + " giờ trước";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + " phút trước";
        }
        if(seconds< 10) return "tức thì";
        return Math.floor(seconds) + " giây trước";
    };
});
angular.module('funstart').filter('expPercent',function () {
    return function (items) {
        if(items){
            return parseInt((items.exp - items.level*items.level*100) / (items.next-items.level*items.level*100)*100);
        } else {
            return 0;
        }
    }
});
angular.module('funstart').filter('winPercent',function () {
    return function (items) {
        if(items){
            return parseInt(items.win/(items.win + items.lose)*100);
        } else {
            return 0;
        }
    }
});