
var socket = io('//www.funstart.net:8088',{'forceNew':true});
$(document).ready(function () {
    if (window.location.href.indexOf('#_=_') > 0) {
        window.location = window.location.href.replace(/#.*/, '');
    }});