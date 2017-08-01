angular.module('funstart', ['ngResource', 'ngRoute', 'ngMaterial', 'ngMessages', 'auth', 'infinite-scroll', 'ngImgCrop','angular-flexslider']);
angular.element(document).ready(function () {
    angular.bootstrap(document, ['funstart']);
});