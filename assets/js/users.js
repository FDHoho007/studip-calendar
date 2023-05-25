function isLoggedIn() {
    return self != null;
}

let self = null;
self = localStorage.getItem("self");
if(self != null)
    self = decodeCalendar(self);

if(location.hash) {
    let calImport = location.hash.substring(1).split(";");
    if(calImport.length == 1) {
        let cal = decodeCalendar(calImport[0]);
        if(cal != null && confirm("You are trying to import " + cal.displayName + "'s studip calendar."))
        importCalendarData(calImport[0]);
    }
    else if(confirm("You are trying to import " + calImport.length + " studip calendars."))
        calImport.forEach(cal => importCalendarData(cal));
    location.href = location.origin + location.pathname;
}

async function importCalendarData(calendar) {
    calendar = decodeCalendar(calendar);
    if(calendar != null && calendar != self && await checkICSUrl(calendar.icsUrl)) {
        if(localStorage.getItem("calendars") == null)
            localStorage.setItem("calendars", encodeCalendar(calendar));
        else
            localStorage.setItem("calendars", localStorage.getItem("calendars") + ";" + encodeCalendar(calendar));
    }
}

function getCalendarData() {
    let calendars = [self];
    if(localStorage.getItem("calendars") != null)
        localStorage.getItem("calendars").split(";").forEach(cal => calendars.push(decodeCalendar(cal)));
    return calendars;
}

function login() {
    let calendar = {
        "displayName": document.getElementById("login-displayName").value,
        "color": document.getElementById("login-calendarColor").value,
        "icsUrl": document.getElementById("login-calendarICSUrl").value
    }
    if(calendar.displayName.trim() == "" || calendar.color.trim() == "" || calendar.icsUrl.trim() == "")
        alert("You must not leave any fields empty!");
    else if(calendar.displayName.includes(",") || calendar.color.includes(",") || calendar.icsUrl.includes(","))
        alert("You must not use , in your name, color or url!");
    else
        checkICSUrl(calendar.icsUrl).then(() => {
            localStorage.setItem("self", encodeCalendar(calendar));
            location.reload();
        }).catch(() => alert("You submitted an invalid ics url. Please try again."));
}

function logout() {
    localStorage.removeItem("self");
    location.reload();
}

function shareUrl() {
    if(navigator.share && isLoggedIn())
        navigator.share({
            title: document.title,
            text: "Here you have my personal StudIP calendar. Please consider sharing yours with me as well :)",
            url: location.origin + location.pathname + "#" + encodeCalendar(self)
        })
        .catch(error => console.log('Error sharing:', error));
}