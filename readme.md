# flux.js
Day- and Nightmode for your website!  
## How?
Dead simple
* Geolocation with [ipinfo.io](www.ipinfo.io)
* Sunrise and sunset calculations with the [sunrise-sunset.org](www.sunrise-sunset.org)-api, 
* jQuery and 
* some CSS 

## Usage/Sample
flux.js runs when the page is loaded, checks your location and whether the sun is up or down, and loads either day.css or night.css accordingly.  
In the sample, day.css does nothing (regular styles), while night.css inverts the luminance of all elements that aren't images.

## Disclaimer
This is just a prototype, improvements that may or may not get implemented are
* Localized geolocation and sun calculations, so we don't have to spam the above mentioned api's.
* Local storage containing your location (with a TTL of for example 12 hrs), for the same reason as above
* Polling mechanism after page load for checking time of day against sunset/sunrise times, so the skin updates while your browsing a page.


I am not in anyway affiliated with the guys who make [f.lux](https://justgetflux.com) for desktop, which btw is awesome and I use every day.