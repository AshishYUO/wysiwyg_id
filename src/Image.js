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
        this.offsetX = null;
        this.offsetY = null;
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

    /**
     * @details Setting up image events
     * @param imageElement 
     */
    setImageEvents(imageElement) {
        const mousemoveOnResizingEvent = event => {
            event.preventDefault(), this.executeResizingEvent(event);
        }
        const mouseupEvent = event => {
            this.setImageEvents(imageElement);
        }

        const setupResizingEvents = event => {
            imageElement.focus();
            const inRange = (value, check) => check >= value - 5 && check <= value + 5;
            const resizeType = (inRange(event.offsetY, imageElement.height) ? 's' : '') + 
                            (inRange(event.offsetX, imageElement.width) ? 'e' : '');

            imageElement.style.cursor = resizeType.length ? `${resizeType}-resize` : 'default';
        }

        const imageClickHold = event => {
            if (imageElement.style.cursor !== 'default') {
                imageElement.onmousemove = mousemoveOnResizingEvent;
                imageElement.onmouseup = mouseupEvent;
            }
        }

        imageElement.removeEventListener('mouseup', mouseupEvent);
        imageElement.onmousemove = setupResizingEvents;
        imageElement.onmousedown = imageClickHold;
    }

    executeResizingEvent(event) {
        const imageElement = event.target;
        const cursor = imageElement.style.cursor.split('-')[0];
        switch(cursor) {
            case 's':
                imageElement.setAttribute('height', event.offsetY + 20);
                break;
            case 'e':
                imageElement.setAttribute('width', event.offsetX + 20);
                break;
            case 'se':
                imageElement.setAttribute('height', event.offsetY + 20);
                imageElement.setAttribute('width', event.offsetX + 20);
                break;
        }
    }

    loadImage(urlStr) {
        const imageNode = document.createElement('img');
        imageNode.setAttribute('src', urlStr);
        const Node = selections.getCurrentNodeFromCaretPosition(this.selection);
        while (!isABlockNode(Node.parentNode)) {
            Node = Node.parentNode;
        }
        this.setImageEvents(imageNode);
        imageNode.setAttribute('width', '1000');
        imageNode.setAttribute('tabindex', '0');
        Node.innerHTML = '';
        Node.appendChild(imageNode);
    }

    matchesWithExtURL(str){
        return str.match(/https?:\/\/.*/);
    }
}
