import { el, elId } from "element/helper";

export const initUIMode = function () {
    const theme = 'data-theme';
    const allTheme = ['light', 'dark', 'blue'];
    let i = 0;
    elId('main-body').do(mainBody => el(mainBody).attr(theme, allTheme[0]));

    elId('mode').do(modeElement => el(modeElement).evt("mousedown", function (event) {
        i = (i + 1) % allTheme.length;
        elId('main-body').do(mainBody => el(mainBody).attr(theme, allTheme[i]));
    }));
}
