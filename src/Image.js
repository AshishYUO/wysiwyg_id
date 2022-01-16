import Selection from './Selection';
import { isABlockNode } from './Utils';

const selections = new Selection();

export default class Image {
    constructor (Node) {
        this.MainBody = Node;
        this.ImageButton = Node.querySelector('.image');
        this.fileElement = document.createElement('input');
        this.fileElement.setAttribute('type', 'file');
        this.FileRead = new FileReader();
        this.selection = undefined;
        this.ImageButton.onclick = event => {
            this.selection = selections.getSelection();
            const URL = this.selection.toString().trim();
            if (URL.length) 
                if (this.matchesWithExtURL(URL)) {
                    this.loadImage(URL);
                }
                else {
                    alert('Invalid URL');
                }
            else {
                this.fileElement.click();
            }
        };

        this.FileRead.onload = event => {
            if (this.selection) {
                this.loadImage(event.target.result);
            }
        }

        this.fileElement.onchange = event => {
            const image = event.target.files[0];
            this.FileRead.readAsDataURL(image);
        }
    }

    loadImage(urlStr) {
        const imageNode = document.createElement('img');
        imageNode.setAttribute('src', urlStr);
        const Node = selections.getCurrentNodeFromCaretPosition(this.selection);
        while (!isABlockNode(Node.parentNode)) {
            Node = Node.parentNode;
        }
        Node.innerHTML = '';
        Node.appendChild(imageNode);
    }

    matchesWithExtURL(str){
        return str.match(/https?:\/\/.*/);
    }
}
