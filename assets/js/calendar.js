const CORS_PROXY = "https://cors.fdhoho007.de/";

function checkICSUrl(ics_url) {
    return new Promise((resolve) => resolve());
}

function getCalendar(ics_url) {
    return fetch(CORS_PROXY + ics_url).text();
}

function encodeCalendar(calendar) {
    if(calendar.displayName && calendar.color && calendar.icsUrl)
        return btoa(calendar.displayName + "," + calendar.color + "," + calendar.icsUrl);
    throw Error("Invalid calendar object");
}

function decodeCalendar(calendar) {
    let calendarObj = atob(calendar).split(",");
    if(calendarObj.length != 3)
        throw Error("Invalid calendar object");
    return {
        "displayName": calendarObj[0],
        "color": calendarObj[1],
        "icsUrl": calendarObj[2]
    }
}