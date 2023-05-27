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

function eventsByDate(calendar) {
    let events = {};
    for(let event of calendar.VEVENT) {
        let dtstart = event["DTSTART"];
        dtstart = dtstart.getDate() + "." + (dtstart.getMonth()+1) + "." + dtstart.getFullYear();
        if(!(dtstart in events))
            events[dtstart] = [];
        events[dtstart].push(event);
    }
    return events;
}

async function getAllCalendars() {
    let calendars = [];
    for(let calData of getCalendarData()) {
        let cal = {
            ...calData,
            ...(await getCalendarFromICS(calData.icsUrl))
        }
        let TZID = cal.VCALENDAR.VTIMEZONE.TZID;
        for(let event of cal.VCALENDAR.VEVENT) {
            event["DTSTART"] = icsDate(event["DTSTART;TZID=" + TZID]);
            event["DTEND"] = icsDate(event["DTEND;TZID=" + TZID]);
        }
        cal["eventsByDate"] = eventsByDate(cal.VCALENDAR);
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