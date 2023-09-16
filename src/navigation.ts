import { el, elId } from "element/helper";

export function initNavigation() {
    const nav = elId('navigation-bar').doGet(nav => (
        nav.style.marginLeft = '-20.3%'
    ));
    elId('navigation-button').doGet(nv => {
        el(nv).evt('mousedown', (_) => nav.style.marginLeft = '0');
    });
    
    elId('navigation-close').do(nvclose => {
       el(nvclose).evt('mousedown', (_) => nav.style.marginLeft = '-20.3%');
    })
}
