angular.module('funstart').factory('$FB', ['$window', function($window) {
    return {
        init: function(fbId) {
            if (fbId) {
                this.fbId = fbId;
                $window.fbAsyncInit = function() {
                    FB.init({
                        appId: fbId,
                        channelUrl: 'app/channel.html',
                        status: true,
                        xfbml: true
                    });
                };
                (function(d) {
                    var js,
                        id = 'facebook-jssdk',
                        ref = d.getElementsByTagName('script')[0];
                    if (d.getElementById(id)) {
                        return;
                    }

                    js = d.createElement('script');
                    js.id = id;
                    js.async = true;
                    js.src = "//connect.facebook.net/en_US/all.js";

                    ref.parentNode.insertBefore(js, ref);
                }(document));
            } else {
                throw ("FB App Id Cannot be blank");
            }
        }
    };

}]);