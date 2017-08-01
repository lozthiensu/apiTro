/**
 * Created by andh on 8/9/16.
 */
angular.module('funstart').config(['$mdThemingProvider',function ($mdThemingProvider) {
    $mdThemingProvider.definePalette('funviolet', {
        '50': '#eaeaf1',
        '100': '#c0c0d7',
        '200': '#9696bd',
        '300': '#6c6ca3',
        '400': '#424289',
        '500': '#2b2e7b',
        '600': '#29286f',
        '700': '#242463',
        '800': '#201f56',
        '900': '#1b1b4a',
        'A100': '#6c6ca3',
        'A200': '#2e2d7c',
        'A400': '#242463',
        'A700': '#1b1b4a',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 200 A100',
        'contrastStrongLightColors': '300 400 A200 A400 A700'
    });
    $mdThemingProvider.definePalette('funorange', {
        '50': '#fdf0ea',
        '100': '#fad4c0',
        '200': '#f8b797',
        '300': '#f59a6d',
        '400': '#f38c58',
        '500': '#f1702f',
        '600': '#d8642a',
        '700': '#c05925',
        '800': '#a84e20',
        '900': '#90431c',
        'A100': '#ffffff',
        'A200': '#f1702f',
        'A400': '#c05925',
        'A700': '#90431c',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 200 A100',
        'contrastStrongLightColors': '500 600 A200 A400 A700'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('funviolet')
        .accentPalette('funorange')
        .warnPalette('deep-orange')
        .backgroundPalette('grey');

}]);