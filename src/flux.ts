/// <reference path="../typings/tsd.d.ts" />

const DAY_MODE_CSS = "/sample/day.css";
const NIGHT_MODE_CSS = "/sample/night.css";
    
module Pzl.Flux{
        
    export function GetLocationSoft(){
     var d = jQuery.Deferred();
     jQuery.get("http://ipinfo.io", function(r) {
        d.resolve(r.loc);
        }, 
        "jsonp"); 
       return d.promise();  
    }

    //TODO: roll own sun calc implementation - this one takes ~10 seconds, crazy slow.
    function GetSunTime(lat:string,lng:string){
        var d = jQuery.Deferred();
          jQuery.get("http://api.sunrise-sunset.org/json?lat="+lat+"&lng="+lng, function(r) {
              console.log(r);
        d.resolve(r);
        }, 
        "jsonp");
        return d.promise();   
    }

    function GetCurrentTime(){
        return new Date();     
    }

    function ApplyCSS(cssUrl : string){
        if (document.createStyleSheet){
            document.createStyleSheet(cssUrl);
        }
        else {
            $("head").append($("<link rel='stylesheet' href='"+cssUrl+"' type='text/css' media='screen' />"));
        }
    }

    export function init(){
        GetLocationSoft().then(function(loc:string){
            var lat = loc.substr(0,loc.indexOf(','));
            var lng = loc.substr(lat.length+1,loc.length);
            GetSunTime(lat,lng).then(function(sunTime){
                
            })     
        })

    }

        jQuery(function(){
        init();
        });

}