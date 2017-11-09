/// <reference path="../typings/tsd.d.ts" />
var DAY_MODE_CSS = "day.css";
var NIGHT_MODE_CSS = "night.css";
var Pzl;
(function (Pzl) {
    var Flux;
    (function (Flux) {
        Flux.log = localStorage.flux_logging || false;
        function GetLocationSoft() {
            var d = jQuery.Deferred();
            jQuery.get("http://ipinfo.io", function (r) {
                Flux.log ? console.log("Got location: " + r.loc) : null;
                d.resolve(r.loc);
            }, "jsonp");
            return d.promise();
        }
        Flux.GetLocationSoft = GetLocationSoft;
        //TODO: roll own sun calc implementation - this one takes ~10 seconds, crazy slow.
        function GetSunTime(lat, lng) {
            var d = jQuery.Deferred();
            jQuery.get("http://api.sunrise-sunset.org/json?lat=" + lat + "&lng=" + lng + "&formatted=0", function (r) {
                if (r.results) {
                    Flux.log ? console.log("Got sunrise/sunset times for " + lat + "N / " + lng + "E") : null;
                    d.resolve(r.results);
                }
                else {
                    d.fail(function () { return "couldn't get sunrise/sunset times"; });
                }
            }, "jsonp");
            return d.promise();
        }
        var currentTime = function () { return new Date().getTime(); };
        function ApplyCSS(cssUrl) {
            Flux.log ? console.log("Applying css \"" + cssUrl + "\"") : null;
            if (document.createStyleSheet) {
                document.createStyleSheet(cssUrl);
            }
            else {
                $("head").append($("<link rel='stylesheet' href='" + cssUrl + "' type='text/css' media='screen' />"));
            }
        }
        //INIT FUNCTION CALLED BY JQUERY IIFE
        function init() {
            GetLocationSoft().then(function (loc) {
                var lat = loc.substr(0, loc.indexOf(','));
                var lng = loc.substr(lat.length + 1, loc.length);
                GetSunTime(lat, lng).then(function (sunTime) {
                    var up = new Date(sunTime.sunrise).getTime(), down = new Date(sunTime.sunset).getTime();
                    Flux.log ? console.log("Got lat/long + suntime: \nsunrise: " + sunTime.sunrise + " - sunset: " + sunTime.sunset) : null;
                    (currentTime() < up) || (currentTime() > down) ?
                        ApplyCSS(NIGHT_MODE_CSS) : ApplyCSS(DAY_MODE_CSS);
                    jQuery("body").fadeIn(300);
                });
            });
        }
        Flux.init = init;
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
    })(Flux = Pzl.Flux || (Pzl.Flux = {}));
})(Pzl || (Pzl = {}));
