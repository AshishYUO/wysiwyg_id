import selection from './selection';
import { isABlockNode } from './editor/block';
import { el, elquery } from 'element/helper';
import { iter_to_par_incl } from 'utils/iter';

export default class Image {
    mainBody: HTMLElement;
    imageButton: HTMLElement;
    fileElement: HTMLElement;
    fileReader: FileReader;
    selection: Selection;

    constructor (Node: HTMLElement) {
        this.mainBody = Node;
        
        this.imageButton = elquery<HTMLImageElement>('.image').doGet(imgBtn => {
            imgBtn.onclick = event => {
                this.selection = selection.sel().get();
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
        });

        this.fileElement = el('input')
            .attr('type', 'file')
            .evt('change', (e: any) => {
                const image = e.target.files[0];
                this.fileReader.readAsDataURL(image);
            })
            .get<HTMLImageElement>();

        this.fileReader = new FileReader();
        this.selection = null;

        this.fileReader.onload = (event: any) => {
            if (this.selection) {
                this.loadImage(event.target.result);
            }
        }
    }

    /**
     * @details Setting up image events
     * @param {HTMLElement} imageElement Image elements for resizing events.
     * @return void
     */
    setImageEvents(imageElement: HTMLImageElement): void {
        const mousemoveOnResizingEvent = (event: Event) => {
            event.preventDefault();
            this.executeResizingEvent(event);
        }
        const mouseupEvent = (event: Event) => {
            imageElement.removeEventListener('mouseup', mouseupEvent);
            this.setImageEvents(imageElement);
        }

        const setupResizingEvents = (event: MouseEvent) => {
            imageElement.focus();
            const inRange = (value: number, check: number) => check >= value - 5 && check <= value + 5;
            const resizeType = (inRange(event.offsetY, imageElement.height) ? 's' : '') + 
                            (inRange(event.offsetX, imageElement.width) ? 'e' : '');

            imageElement.style.cursor = resizeType.length ? `${resizeType}-resize` : 'default';
        }

        const imageClickHold = (event: MouseEvent) => {
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

    loadImage(urlStr: string) {
        const imageNode = el('img').attrs([
            ['src', urlStr],
            ['width', '1000'],
            ['tabindex', '0']
        ]).get<HTMLImageElement>();

        let node = selection.getCurrentNodeFromCaretPosition(this.selection);

        node = iter_to_par_incl(node).till(n => !isABlockNode(node)).last();        
        this.setImageEvents(imageNode);
        
        el<HTMLElement>(node as HTMLElement).innerHtml('').appendChild(imageNode);
    }

    matchesWithExtURL(str: string){
        return str.match(/https?:\/\/.*/);
    }
}
