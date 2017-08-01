// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.
var adsContainer = $("#contentElement");
width_ads = adsContainer.width();
heightGame = adsContainer.height();
height_ads = heightGame;

$("#adContainer").width(adsContainer.width());
$("#adContainer").height(adsContainer.height());

var channel_id = '8788971041'; //channel ads main
var href_ads = top.window.location.href;
var url_ads = "https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_text_image_flash&client=ca-games-pub-8167045239596974&description_url="+href_ads+"&channel="+channel_id+"&videoad_start_delay=0&hl=en&max_ad_duration=30000";
var eventAdsense = new adsAdsense();

var adsManager;
var adsLoader;
var adDisplayContainer;
var intervalTimer;
var videoContent = document.getElementById('contentElement');
function createAdDisplayContainer() {
    // We assume the adContainer is the DOM id of the element that will house
    // the ads.
    adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('adContainer'));
}

function requestAds() {
    // console.log(url_ads);
    // Create the ad display container.
    createAdDisplayContainer();
    // Initialize the container. Must be done via a user action on mobile devices.
    adDisplayContainer.initialize();
    // Create ads loader.
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    // Listen and respond to ads loaded and error events.
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

    // Request video ads.
    var adsRequest = new google.ima.AdsRequest();
    //adsRequest.adTagUrl = "http://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image_flash&client=ca-games-pub-5477307030870200&description_url=http://www.topnhe.com/317/10-ly-do-khong-nen-song-o-da-nang&videoad_start_delay=0&hl=vi&max_ad_duration=30000";
    adsRequest.adTagUrl = url_ads;
    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = width_ads;
    adsRequest.linearAdSlotHeight = height_ads;

    adsRequest.nonLinearAdSlotWidth = width_ads;
    adsRequest.nonLinearAdSlotHeight = height_ads;

    adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Get the ads manager.
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoContent);  // should be set to the content video element

    // Add listeners to the required events.
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);

    // Listen to any additional events, if necessary.
    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CLICK,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.USER_CLOSE,
        onAdEvent);

    try {
        // Initialize the ads manager. Ad rules playlist will start at this time.
        adsManager.init(width_ads, heightGame, google.ima.ViewMode.NORMAL);
        // Call play to start showing the ad. Single video and overlay ads will
        // start at this time; the call will be ignored for ad rules.
        adsManager.start();
    } catch (adError) {
        // An error may be thrown if there was a problem with the VAST response.
        //videoContent.play();
        eventAdsense.skipAds()
    }
}

function onAdEvent(adEvent) {
    // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
    // don't have ad object associated.
    var ad = adEvent.getAd();
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
            // This is the first event sent for an ad - it is possible to
            // determine whether the ad is a video ad or an overlay.
            if (!ad.isLinear()) {
                // Position AdDisplayContainer correctly for overlay.
                // Use ad.width and ad.height.
            }
            eventAdsense.doneLoad();
            break;
        case google.ima.AdEvent.Type.STARTED:
            // This event indicates the ad has started - the video player
            // can adjust the UI, for example display a pause button and
            // remaining time.
            if (ad.isLinear()) {
                // For a linear ad, a timer can be started to poll for
                // the remaining time.
                intervalTimer = setInterval(
                    function() {
                        var remainingTime = adsManager.getRemainingTime();
                    },
                    300); // every 300ms
            }
            break;
        case google.ima.AdEvent.Type.COMPLETE:
            // This event indicates the ad has finished - the video player
            // can perform appropriate UI actions, such as removing the timer for
            // remaining time detection.
            if (ad.isLinear()) {
                clearInterval(intervalTimer);
            }
            break;

        case google.ima.AdEvent.Type.CLICK:
            //when user click this ads
            eventAdsense.click();
            break;


        case google.ima.AdEvent.Type.USER_CLOSE:
            //when user click this ads
            eventAdsense.close();
            break;
    }
}

function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());

    eventAdsense.skipAds();

    adsManager.destroy();
}

function onContentPauseRequested() {
    //videoContent.pause();
    // This function is where you should setup UI for showing ads (e.g.
    // display ad timer countdown, disable seeking etc.)
    // setupUIForAds();
}

function onContentResumeRequested() {
    //videoContent.play();

    eventAdsense.skipAds();

    // This function is where you should ensure that your UI is ready
    // to play content. It is the responsibility of the Publisher to
    // implement this function when necessary.
    // setupUIForContent();

}

function adsAdsense() {
    this.close = function () {
        this.FuncCallback();
        this.skipAds();
    };
    this.load = function(obj,callback){
        if(typeof obj === 'object'){
            if(obj.channel_id) channel_id = obj.channel_id;
            if(obj.href_ads) href_ads = obj.href_ads;
            url_ads = "https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_text_image_flash&client=ca-games-pub-8167045239596974&description_url="+href_ads+"&channel="+channel_id+"&videoad_start_delay=0&hl=en&max_ad_duration=30000";
        }
        $("#adContainer").html("").css('display','block');
        requestAds();
        console.log('Load new ads');

        if (callback) callback();
    };
    this.doneLoad = function () {
        console.log('ads done load');
    };
    this.click = function () {
        this.skipAds();
    };
    this.FuncCallback = function(){
        console.log('user click close ads 0');
    };
    this.skipAds = function () {
        document.getElementById('adContainer').style.display = 'none';
    }
}

