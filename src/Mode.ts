export const initUIMode = function () {
    const theme = "data-theme";
    var AppliedTheme = ["light", "dark", "blue"];
    var i = 0;
    var main_body = document.getElementById("main-body");
    main_body.setAttribute(theme, AppliedTheme[0]);

    document.getElementById("mode").addEventListener("mousedown", function (event) {
        i = (i + 1) % AppliedTheme.length;
        var main_body = document.getElementById("main-body");
        main_body.setAttribute(theme, AppliedTheme[i]);
    });
}
