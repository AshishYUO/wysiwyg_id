var AppliedTheme = ["light", "dark", "blue"];
var theme = "data-theme";
var i = 0;
window.onload = function() {
    var main_body = document.getElementById("main-body");
    main_body.setAttribute(theme, AppliedTheme[0]);
}

document.getElementById("mode").addEventListener("mousedown", function(event) {
    i = (i+1)%AppliedTheme.length;
    var main_body = document.getElementById("main-body");
    main_body.setAttribute(theme, AppliedTheme[i]);
});
