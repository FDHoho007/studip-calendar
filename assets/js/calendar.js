const CORS_PROXY = "https://cors-proxy.fdhoho007.de/";

async function checkICSUrl(ics_url) {
    const r = await fetch(CORS_PROXY + ics_url);
    let ics_text = await r.text();
    return ics_text.startsWith("BEGIN:VCALENDAR");
}

async function getCalendarFromICS(ics_url) {
    const r = await fetch(CORS_PROXY + ics_url);
    let ics_text = await r.text();
    return parseICS(ics_text);
}

async function getAllCalendars() {
    let calendars = [];
    for(let calData of getCalendarData()) {
        let cal = {
            ...calData,
            ...(await getCalendarFromICS(calData.icsUrl))
        }
        calendars.push(cal);
    }
    return calendars;
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