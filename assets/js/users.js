function isLoggedIn() {
    return self != null;
}

let self = null;
self = localStorage.getItem("self");
if(self != null)
    self = decodeCalendar(self);

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
            text: "Hello World",
            url: location.origin + location.pathname + "#" + encodeCalendar(self)
        })
        .catch(error => console.log('Error sharing:', error));
}