class ColorPicker {
    constructor (Node) {
        this.red = document.getElementById("red");
        this.green = document.getElementById("green");
        this.blue = document.getElementById("blue");
        this.colors = document.getElementById("colors");
        this.colorsTab = document.getElementById("color-tab");
        this.labelRed = document.getElementById('lr');
        this.labelGreen = document.getElementById('lg');
        this.labelBlue = document.getElementById('lb');
        this.backgr = document.getElementById("background");
        this.foreColor = Node.getElementsByClassName('foreColor')[0];
        this.highlight = Node.getElementsByClassName('highlight')[0];
        this.highlightSample = Node.getElementsByClassName("highlight-color-sample")[0];
        this.fontSample = Node.getElementsByClassName("font-color-sample")[0];
        this.submitColor = document.getElementById("return");
        this.PalletFor = undefined;

        this.red.oninput = (event) => {
            this.labelRed.innerHTML = `R: ${green.value}`;
            this.backgr.style.background = this.getRGB();
        }
        this.green.oninput = (event) => {
            this.labelGreen.innerHTML = `G: ${green.value}`;
            this.backgr.style.background = this.getRGB();
        }
        this.blue.oninput = (event) => {
            this.labelBlue.innerHTML = `B: ${green.value}`;
            this.backgr.style.background = this.getRGB();
        }

        this.foreColor && this.foreColor.addEventListener('click', (event) => {
            document.execCommand("foreColor", false, this.fontSample.style.backgroundColor);
        });

        this.highlight && this.highlight.addEventListener('click', (event) => {
            document.execCommand("HiliteColor", false, this.highlightSample.style.backgroundColor);
        });

        this.colors.onchange = (event) => {
            let colors = this.colors.value.match(/rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/);
            this.red.value = colors[1];
            this.green.value = colors[2];
            this.blue.value = colors[3];
            this.labelRed.innerHTML = `R: ${this.red.value}`;
            this.labelGreen.innerHTML = `G: ${this.green.value}`;
            this.labelBlue.innerHTML = `B: ${this.blue.value}`;
            this.backgr.style.background = this.getRGB();
        }

        this.highlightSample.addEventListener("mousedown", (event) => {
            if(this.colorsTab.classList.contains("hide") == true) {
                this.colorsTab.classList.remove("hide");
                this.PalletFor = this.highlightSample;
            } else
                this.colorsTab.classList.add("hide");
        });

        this.fontSample.addEventListener("mousedown", (event) => {
            if(this.colorsTab.classList.contains("hide") == true) {
                this.colorsTab.classList.remove("hide");
                this.PalletFor = this.fontSample;
            } else
                this.colorsTab.classList.add("hide");
        });

        this.submitColor.addEventListener("click", (event) => {
            var rgb = this.getColorByRGB([red.value, green.value, blue.value]), color = '';
    
            color = rgb != null ? `${rgb} - ` : '';
            color += this.getRGB();
    
            document.getElementById("ans").innerHTML = `Color: ${color}`;
    
            let redhex = this.returnHexVal(red.value), greenhex = this.returnHexVal(green.value), bluehex = this.returnHexVal(blue.value);
            this.PalletFor.style.backgroundColor = `#${redhex+greenhex+bluehex}`;
        });
    
        this.colorsList = {
            "red": [255, 0, 0], 
            "blue": [0, 0, 255], 
            "green": [0, 255, 0], 
            "yellow": [255, 255, 0], 
            "cyan": [0, 255, 255], 
            "magenta": [255, 0, 255], 
            "orange": [255, 128, 0], 
            "lime green": [128, 255, 0], 
            "royal blue": [0, 128, 255], 
            "black": [0, 0, 0], 
            "white": [255, 255 ,255],
            "purple": [128, 0, 255], 
            "pink": [255, 0, 128]
        };
        for(let color in this.colorsList) {
            let element = document.createElement("option");
            element.setAttribute("value", `rgb(${this.colorsList[color][0]}, ${this.colorsList[color][1]}, ${this.colorsList[color][2]})`);
            element.innerHTML = color;
            this.colors.appendChild(element);
        }
        this.fontSample.style.backgroundColor = "#000";
        this.highlightSample.style.backgroundColor = "#fff";
    }

    getRGB() {
        return `rgb(${this.red.value}, ${this.green.value}, ${this.blue.value})`;
    }

    getColorByRGB(value) {
        return Object.keys(this.colorsList).find(color => (this.colorsList[color][0] == value[0] && this.colorsList[color][1] == value[1] && this.colorsList[color][2] == value[2]));
    }

    returnHexVal(value) {
        let hex = "0123456789ABCDEF";
        return hex[Math.floor(value / 16) % 16] + hex[value % 16];
    }
}
