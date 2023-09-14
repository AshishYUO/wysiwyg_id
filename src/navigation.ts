import { el, id } from "element/helper";

class Navigation {
    navigation: HTMLElement;
    navigationButton: HTMLElement;
    navigationClose: HTMLElement;

    constructor () {
        this.navigation = id('navigation-bar').get();
        this.navigationButton = id('navigation-button').doGet(nv => {
            el(nv).evt('mousedown', (e) => this.navigation.style.marginLeft = '0');
        });;
        this.navigationClose = id('navigation-close').get()

        this.navigation.style.marginLeft = '-20.3%';

        this.navigationClose.addEventListener('mousedown', (event) => {
            this.navigation.style.marginLeft = '-20.3%';
        });
    }
}
