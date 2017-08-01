angular.module('auth').factory('AuthFacebook',['$resource',function($resource){
    return $resource('/oauth/facebook');
}]);
angular.module('auth').factory('AuthToken',['$resource',function($resource){
    return $resource('/api/token');
}]);
angular.module('auth').factory('AuthSignup',['$resource',function($resource){
    return $resource('/auth/signup');
}]);
angular.module('auth').factory('AuthSignin',['$resource',function($resource){
    return $resource('/auth/signin');
}]);
angular.module('auth').factory('ActionReset',['$resource',function($resource){
    return $resource('/action/reset/:token',{
        token: '@token'
    });
}]);