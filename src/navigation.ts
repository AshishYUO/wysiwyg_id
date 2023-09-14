class Navigation {
    navigation: HTMLElement | null = null;
    navigationButton: HTMLElement | null = null;
    navigationClose: HTMLElement | null = null;
    constructor () {
        this.navigation = document.getElementById("navigation-bar");
        this.navigationButton = document.getElementById("navigation-button");
        this.navigationClose = document.getElementById("navigation-close");
        this.navigation.style.marginLeft = "-20.3%";
        
        this.navigationButton.addEventListener("mousedown", (event) => {
            this.navigation.style.marginLeft = "0";
        });

        this.navigationClose.addEventListener("mousedown", (event) => {
            this.navigation.style.marginLeft = "-20.3%";
        });
    }
}
