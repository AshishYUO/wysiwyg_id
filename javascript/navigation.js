class Navigation {
    constructor () {
        this.Navigation = document.getElementById("navigation-bar");
        this.NavigationButton = document.getElementById("navigation-button");
        this.NavigationClose = document.getElementById("navigation-close");
        this.Navigation.style.marginLeft = "-20.3%";
        
        this.NavigationButton.addEventListener("mousedown", (event) => {
            this.Navigation.style.marginLeft = "0";
        });

        this.NavigationClose.addEventListener("mousedown", (event) => {
            this.Navigation.style.marginLeft = "-20.3%";
        });
    }
}
