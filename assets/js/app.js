if(isLoggedIn()) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("calendar").style.display = "";
}
else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("login").style.display = "";
}