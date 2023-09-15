import { el, elId } from "element/helper";

class Navigation {
    navigation: HTMLElement;
    navigationButton: HTMLElement;
    navigationClose: HTMLElement;

    constructor () {
        this.navigation = elId('navigation-bar').get();
        this.navigationButton = elId('navigation-button').doGet(nv => {
            el(nv).evt('mousedown', (e) => this.navigation.style.marginLeft = '0');
        });;
        this.navigationClose = elId('navigation-close').get()

        this.navigation.style.marginLeft = '-20.3%';

        this.navigationClose.addEventListener('mousedown', (event) => {
            this.navigation.style.marginLeft = '-20.3%';
        });
    }
}
