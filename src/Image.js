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
        const mouseupEvent = event => {
            imageElement.removeEventListener('mousemove', this.executeResizingEvent);
            this.setImageEvents(imageElement);
        }
        const mousemoveEvent = event => {
            event.preventDefault();
            this.executeResizingEvent(event);
        }
        imageElement.removeEventListener('mouseup', mouseupEvent);
        imageElement.onmousemove = this.setupResizingEvents;
        imageElement.onmousedown = event => {
            console.log('mouse down', imageElement.style.cursor);
            if (imageElement.style.cursor !== 'default') {
                imageElement.removeEventListener('mousemove', this.setupResizingEvents);
                [ this.offsetX, this.offsetY ] = [event.offsetX, event.offsetY];
                imageElement.onmousemove = mousemoveEvent;
                imageElement.onmouseup = mouseupEvent;
            }
        }
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

    setupResizingEvents(event) {
        const imageElement = event.target;
        const inRange = (value, check) => check >= value - 5 && check <= value + 5;
        const resizeType = inRange(event.offsetY, imageElement.height) ? 's' : '' + 
                           inRange(event.offsetX, imageElement.width) ? 'e' : '';

        imageElement.style.cursor = resizeType.length ? `${resizeType}-resize` : 'default';
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
        Node.innerHTML = '';
        Node.appendChild(imageNode);
    }

    matchesWithExtURL(str){
        return str.match(/https?:\/\/.*/);
    }
}
