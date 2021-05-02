class ImageBuilder {
    constructor (Node) {
        this.MainBody = Node;
        this.ImageButton = Node.getElementsByClassName("image")[0];
        this.fileElement = document.createElement("input");
        this.fileElement.setAttribute("type", "file");
        this.FileRead = new FileReader();
        this.selection = undefined;
        this.ImageButton.addEventListener("click", (event) => {
            this.selection = selections.getSelection();
            let URL = this.selection.toString().trimLeft().trimRight();
            if (URL.length > 0) 
                if (this.matchesWithExtURL(URL)) {
                    document.execCommand("insertimage", false, this.selection.toString());
                }
                else {
                    alert("Invalid URL");
                }
            else 
                this.fileElement.click();
        });

        this.FileRead.onload = (e) => {
            if (this.selection) {
                let imageNode = document.createElement("img");
                imageNode.setAttribute("src", e.target.result);
                let Node = selections.getCurrentNodeFromCaretPosition(this.selection);
                while (Node.parentNode != this.MainBody) {
                    Node = Node.parentNode;
                }
                Node.innerHTML = "";
                Node.appendChild(imageNode);
            }
        }

        this.fileElement.onchange = (event) => {
            let image = event.target.files[0];
            console.log(image);
            this.FileRead.readAsDataURL(image);
        }
    }

    matchesWithExtURL = (str) => {
        return str.match(/https?:\/\/.*/);
    }
}
