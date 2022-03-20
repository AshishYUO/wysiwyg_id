import selection from './Selection';
import { isABlockNode } from './Editor/Block';

export default class Image {
    mainBody: HTMLElement = null;
    imageButton: HTMLElement = null;
    fileElement: HTMLElement = null;
    fileReader: FileReader = null;
    selection: Selection = null;

    constructor (Node) {
        this.mainBody = Node;
        this.imageButton = Node.querySelector('.image');
        this.fileElement = document.createElement('input');
        this.fileElement.setAttribute('type', 'file');
        this.fileReader = new FileReader();
        this.selection = undefined;
        this.imageButton.onclick = event => {
            this.selection = selection.getSelection();
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

        this.fileReader.onload = (event: any) => {
            if (this.selection) {
                this.loadImage(event.target.result);
            }
        }

        this.fileElement.onchange = (event: any) => {
            const image = event.target.files[0];
            this.fileReader.readAsDataURL(image);
        }
    }

    /**
     * @details Setting up image events
     * @param {HTMLElement} imageElement Image elements for resizing events.
     * @return void
     */
    setImageEvents(imageElement: HTMLImageElement): void {
        const mousemoveOnResizingEvent = event => {
            event.preventDefault();
            this.executeResizingEvent(event);
        }
        const mouseupEvent = event => {
            imageElement.removeEventListener('mouseup', mouseupEvent);
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
                imageElement.onmouseout = mouseupEvent;
            }
        }

        imageElement.removeEventListener('mouseup', mouseupEvent);
        imageElement.onmousemove = setupResizingEvents;
        imageElement.onmousedown = imageClickHold;
    }

    executeResizingEvent (event: any): void {
        const imageElement = event.target;
        const cursor = imageElement.style.cursor.split('-')[0];
        switch(cursor) {
            case 'e':
            case 'se':
                imageElement.setAttribute('width', event.offsetX + 5);
                break;
        }
    }

    loadImage(urlStr) {
        const imageNode = document.createElement('img');
        imageNode.setAttribute('src', urlStr);
        let node = selection.getCurrentNodeFromCaretPosition(this.selection);
        while (!isABlockNode(node)) {
            node = node.parentNode;
        }
        this.setImageEvents(imageNode);
        imageNode.setAttribute('width', '1000');
        imageNode.setAttribute('tabindex', '0');
        const element = node as HTMLElement;
        element.innerHTML = '';
        node = element as Node;
        node.appendChild(imageNode);
    }

    matchesWithExtURL(str){
        return str.match(/https?:\/\/.*/);
    }
}
