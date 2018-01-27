module CJD.Flux {

    const DAY_MODE_CSS = "day.css";
    const NIGHT_MODE_CSS = "night.css";

    export const GetLocationSoft = () => fetch("//freegeoip.net/json/", { method: "GET" }).then(d => d.json().then(j => j))
    export const GetSunRise = (loc: { latitude: string, longitude: string }) => new Date().sunrise(parseInt(loc.latitude), parseInt(loc.longitude))
    export const GetSunSet = (loc: { latitude: string, longitude: string }) => new Date().sunset(parseInt(loc.latitude), parseInt(loc.longitude))
    export const currentTime = () => new Date().getTime()

    const ApplyCSS = (url: string) => {
        const css: HTMLLinkElement = document.createElement("link")
        css.rel = "stylesheet"
        css.type = "text/css"
        css.href = url
        document.head.appendChild(css)
    }

    export let init = () => {
        GetLocationSoft().then((loc: { latitude: string, longitude: string }) => {
            console.log(`Location: ${loc.latitude} - ${loc.longitude} at ${currentTime()}`)
            console.log(`Current time: ${currentTime()}`)
            const up = new Date(GetSunRise(loc)).getTime()
            const down = new Date(GetSunSet(loc)).getTime();
            console.log(`Sunrise: ${up}`);
            console.log(`Sunset: ${down}`);
            currentTime() < up || currentTime() > down ? ApplyCSS(NIGHT_MODE_CSS) : ApplyCSS(DAY_MODE_CSS)
        })
    }

    (() => init())();
}

interface Date {
    sunrise(latitude: number, longitude: number, zenith?: number): any;
    sunset(latitude: number, longitude: number, zenith?: number): any;
    sunriseSet(latitude: number, longitude: number, sunrise: boolean, zenith?: number): any;
    getDayOfYear(): number;
}

interface Math {
    degToRad(num: number): number;
    radToDeg(num: number): number;
    sinDeg(num: number): number;
    acosDeg(num: number): number;
    asinDeg(num: number): number;
    tanDeg(num: number): number;
    cosDeg(num: number): number;
    degToRad(num: number): number;
    mod(a: number, b: number): number;
}

const DATE_DEGREES_PER_HOUR = (360 / 24);

Date.prototype.sunrise = function (latitude, longitude, zenith) { return this.sunriseSet(latitude, longitude, true, zenith) }
Date.prototype.sunset = function (latitude, longitude, zenith) { return this.sunriseSet(latitude, longitude, false, zenith) }

Date.prototype.sunriseSet = function (latitude, longitude, sunrise, zenith) {
    if (!zenith) { zenith = 90.8333; }

    let hoursFromMeridian = longitude / DATE_DEGREES_PER_HOUR,
        dayOfYear = this.getDayOfYear(),
        cosLocalHourAngle,
        approxTimeOfEventInDays,
        sunMeanAnomaly,
        sunTrueLongitude,
        ascension,
        rightAscension,
        lQuadrant,
        raQuadrant,
        sinDec,
        cosDec,
        localHourAngle,
        localHour,
        localMeanTime,
        time;

    if (sunrise) { approxTimeOfEventInDays = dayOfYear + ((6 - hoursFromMeridian) / 24); }
    else { approxTimeOfEventInDays = dayOfYear + ((18.0 - hoursFromMeridian) / 24); }

    sunMeanAnomaly = (0.9856 * approxTimeOfEventInDays) - 3.289;
    sunTrueLongitude = sunMeanAnomaly + (1.916 * Math.sinDeg(sunMeanAnomaly)) + (0.020 * Math.sinDeg(2 * sunMeanAnomaly)) + 282.634;
    sunTrueLongitude = Math.mod(sunTrueLongitude, 360);
    ascension = 0.91764 * Math.tanDeg(sunTrueLongitude);
    rightAscension = 360 / (2 * Math.PI) * Math.atan(ascension);
    rightAscension = Math.mod(rightAscension, 360);
    lQuadrant = Math.floor(sunTrueLongitude / 90) * 90;
    raQuadrant = Math.floor(rightAscension / 90) * 90;
    rightAscension = rightAscension + (lQuadrant - raQuadrant);
    rightAscension /= DATE_DEGREES_PER_HOUR;
    sinDec = 0.39782 * Math.sinDeg(sunTrueLongitude);
    cosDec = Math.cosDeg(Math.asinDeg(sinDec));
    cosLocalHourAngle = ((Math.cosDeg(zenith)) - (sinDec * (Math.sinDeg(latitude)))) / (cosDec * (Math.cosDeg(latitude)));
    localHourAngle = Math.acosDeg(cosLocalHourAngle)

    if (sunrise) { localHourAngle = 360 - localHourAngle; }

    localHour = localHourAngle / DATE_DEGREES_PER_HOUR;

    localMeanTime = localHour + rightAscension - (0.06571 * approxTimeOfEventInDays) - 6.622;

    time = localMeanTime - (longitude / DATE_DEGREES_PER_HOUR);
    time = Math.mod(time, 24);

    const midnight = new Date(0);
    midnight.setUTCFullYear(this.getUTCFullYear());
    midnight.setUTCMonth(this.getUTCMonth());
    midnight.setUTCDate(this.getUTCDate());
    const milli = midnight.getTime() + (time * 60 * 60 * 1000);
    return new Date(milli);
}

Date.prototype.getDayOfYear = function () {
    const onejan: number = new Date(this.getFullYear(), 0, 1).getTime();
    return Math.ceil((this.getTime() - onejan) / 86400000);
}

Math.degToRad = (num: number) => num * Math.PI / 180
Math.radToDeg = (radians) => radians * 180.0 / Math.PI
Math.sinDeg = (deg) => Math.sin(deg * 2.0 * Math.PI / 360.0)
Math.acosDeg = (x) => Math.acos(x) * 360.0 / (2 * Math.PI)
Math.asinDeg = (x) => Math.asin(x) * 360.0 / (2 * Math.PI)
Math.tanDeg = (deg) => Math.tan(deg * 2.0 * Math.PI / 360.0)
Math.cosDeg = (deg) => Math.cos(deg * 2.0 * Math.PI / 360.0)
Math.mod = (a, b) => {
    let result = a % b;
    return (result) < 0 ? result += b : result;
}
