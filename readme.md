# flux.js
Day- and Nightmode for your website!  
## How?
Dead simple
* Geolocation with [freegeoip.net](www.freegeoip.net)
* Sunrise/sunset calculations with Matt Kane's sunrise / sunset Date.prototype [sun-js](https://github.com/Triggertrap/sun-js/)
* Day- and Nightmode CSS 

## Usage/Sample
flux.js runs when the page is loaded, checks your location (softly - we're not annoying users with navigator.geolocation.getCurrentPosition), whether the sun is up or down, and loads either day.css or night.css accordingly.  
In the sample, normal.css is loaded at startup (grey background), while day.css is white and night.css inverts the luminance of all elements that aren't images.

## Disclaimer
This is just a prototype, improvements that may or may not get implemented are
* Localized soft geolocating, so we don't have to spam the above mentioned api's.
* Caching
* Polling mechanism after page load for checking time of day against sunset/sunrise times, so the skin updates while you're browsing a page.


I am not in any way affiliated with the guys who make [f.lux](https://justgetflux.com) for desktop, which btw is awesome and I use every day.