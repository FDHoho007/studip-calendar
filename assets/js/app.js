let date = new Date();
let calendars = [];
const DAY_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function createSchedule() {
    calendars = await getAllCalendars();
    for(let c of calendars) {
        c.domElement = document.createElement("div");
        c.domElement.classList.add("calendar");
        let title = document.createElement("div");
        title.classList.add("title");
        title.innerText = c.displayName;
        c.domElement.appendChild(title);
        let events = document.createElement("div");
        events.classList.add("events");
        c.domElement.appendChild(events);
        document.querySelector("#schedule .calendars").appendChild(c.domElement);
    }
    document.getElementById("schedule").style.setProperty("--numCalendars", calendars.length);
    renderSchedule();
}

function renderSchedule() {
    for(let c of calendars) {
        let events = c.domElement.getElementsByClassName("events")[0];
        events.innerHTML = "";
        let dateString = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
        document.getElementById("date-title").innerHTML = DAY_OF_WEEK[date.getDay()] + "<br>" + dateString;
        if(dateString in c.eventsByDate)
            for(let e of c.eventsByDate[dateString]) {
                let event = document.createElement("div");
                event.classList.add("event");
                event.classList.add("start-" + e.DTSTART.getHours());
                event.classList.add("end-" + e.DTEND.getHours());
                event.style.background = c.color;
                let title = document.createElement("p");
                title.classList.add("title");
                title.innerText = e.SUMMARY;
                event.appendChild(title);
                events.appendChild(event);
            }
    }
}

function navigateBack() {
    date.setTime(date.getTime() - 24*60*60*1000);
    renderSchedule();
}

function navigateToDate() {
    let datePicker = document.createElement("input");
    datePicker.type = "date";
    datePicker.onchange = () => {
        date = new Date(datePicker.value);
        renderSchedule();
    }
    datePicker.showPicker();
}

function navigateForward() {
    date.setTime(date.getTime() + 24*60*60*1000);
    renderSchedule();
}

if(isLoggedIn()) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("calendar").style.display = "";
    createSchedule();
}
else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("login").style.display = "";
}