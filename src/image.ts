import selection from './selection';
import { isABlockNode } from './editor/block';
import { el, elQuery } from 'element/helper';
import { nodeIter } from 'utils/iter';

export default class Image {
    mainBody: HTMLElement;
    imageButton: HTMLElement;
    fileElement: HTMLInputElement;
    fileReader: FileReader;

    constructor (Node: HTMLElement) {
        this.mainBody = Node;
        
        this.imageButton = elQuery<HTMLImageElement>('.image').doGet(imgBtn => {
            imgBtn.onclick = event => selection.sel().do(sel => {
                const url = sel.toString().trim();
                if (url.length) {
                    if (this.matchesWithExtURL(url)) {
                        this.loadImage(url);
                    } else {
                        alert('Invalid URL');
                    }
                } else {
                    this.fileElement.click();
                }
            });
        });

        this.fileElement = el<HTMLInputElement>('input')
            .attr('type', 'file')
            .evt('change', (e: any) => {
                this.fileReader.readAsDataURL(e.target.files[0]);
            })
            .get();

        this.fileReader = new FileReader();

        this.fileReader.onload = (event: ProgressEvent<FileReader>) => {
            selection.sel().do(_ => (
                this.loadImage(event.target.result as string)
            ));
        }
    }

    /**
     * @details Setting up image events
     * @param {HTMLElement} imageElement Image elements for resizing events.
     * @return void
     */
    setImageEvents(imageElement: HTMLImageElement): void {
        const mousemoveOnResizingEvent = (event: MouseEvent) => {
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

    executeResizingEvent (event: MouseEvent): void {
        const imageElement = event.target as HTMLImageElement;
        const cursor = imageElement.style.cursor.split('-')[0];
        switch (cursor) {
            case 'e':
            case 'se':
                el(imageElement).attr('width', `${event.offsetX + 5}`);
                break;
        }
    }

    loadImage(urlStr: string) {
        const imageNode = el('img').attrs([
            ['src', urlStr],
            ['width', '1000'],
            ['tabindex', '0']
        ]).get<HTMLImageElement>();

        selection.getCurrentNodeFromCaretPosition().do(node => {
            node = nodeIter(node, n => n.parentNode, true)
                .till(n => !isABlockNode(n))
                .last();

            this.setImageEvents(imageNode);
            el<HTMLElement>(node as HTMLElement)
                .innerHtml('')
                .appendChild(imageNode);
        });        
    }

    matchesWithExtURL(str: string) {
        return str.match(/https?:\/\/.*/).length > 0;
    }
}
