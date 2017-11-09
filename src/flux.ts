/// <reference path="../typings/tsd.d.ts" />

const DAY_MODE_CSS = "day.css";
const NIGHT_MODE_CSS = "night.css";

module Pzl.Flux {
    export let log = localStorage.flux_logging || false;

    export function GetLocationSoft() {
        var d = jQuery.Deferred();
        jQuery.get("http://ipinfo.io", function (r) {
            log ? console.log(`Got location: ${r.loc}`) : null;
            d.resolve(r.loc);
        },
            "jsonp");
        return d.promise();
    }

    //TODO: roll own sun calc implementation - this one takes ~10 seconds, crazy slow.
    function GetSunTime(lat: string, lng: string) {
        var d = jQuery.Deferred();
        jQuery.get("http://api.sunrise-sunset.org/json?lat=" + lat + "&lng=" + lng + "&formatted=0", r => {
            if (r.results) {
                log ? console.log(`Got sunrise/sunset times for ${lat}N / ${lng}E`) : null;
                d.resolve(r.results);
            } else { d.fail(() => `couldn't get sunrise/sunset times`) }
        },
            "jsonp");
        return d.promise();
    }


    const currentTime = function () { return new Date().getTime() };

    function ApplyCSS(cssUrl: string) {
        log ? console.log(`Applying css "${cssUrl}"`) : null;
        if (document.createStyleSheet) {
            document.createStyleSheet(cssUrl);
        }
        else {
            $("head").append($("<link rel='stylesheet' href='" + cssUrl + "' type='text/css' media='screen' />"));
        }
    }

    //INIT FUNCTION CALLED BY JQUERY IIFE
    export function init() {
        GetLocationSoft().then(function (loc: string) {
            var lat = loc.substr(0, loc.indexOf(','));
            var lng = loc.substr(lat.length + 1, loc.length);
            GetSunTime(lat, lng).then(function (sunTime: { sunrise: string, sunset: string }) {
                const up = new Date(sunTime.sunrise).getTime(),
                    down = new Date(sunTime.sunset).getTime();
                log ? console.log(`Got lat/long + suntime: \nsunrise: ${sunTime.sunrise} - sunset: ${sunTime.sunset}`) : null;
                (currentTime() < up) || (currentTime() > down) ?
                    ApplyCSS(NIGHT_MODE_CSS) : ApplyCSS(DAY_MODE_CSS);
                jQuery("body").fadeIn(300);
            })
        })

    }

    //IIFE LOADING JQUERY
    (function () {
        if (typeof jQuery != 'undefined') {
            return;
        }
        var script = document.createElement('script');
        script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = function () {
            jQuery(document).ready(function () {
                init();
            });
        };
    }());
}