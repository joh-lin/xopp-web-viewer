import './style.scss'
import { load_file } from './load-file';
import { render_to_canvas } from './render-canvas';


const xoppViewer = <HTMLElement>document.getElementsByClassName("xopp-viewer")[0];
const fileLoaderView = <HTMLElement>document.getElementsByClassName("file-loader")[0];
const fileDropZone = <HTMLInputElement>document.getElementsByClassName("file-drop-zone")[0];

xoppViewer.style.display = "none";

/*if ("launchQueue" in window) {
    let launchQueue: any = window.launchQueue
    launchQueue.setConsumer(async (launchParams: any) => {
        if (launchParams.files && launchParams.files.length == 1) {
            const selectedFile: FileSystemFileHandle = launchParams.files[0];
            console.log(selectedFile);
            selectedFile.getFile().then((file: File) => {
                load_file(file).then((xmlDoc) => {
                    open_file(xmlDoc)
                });
            })
            
        }
    });
  }*/

fileDropZone.addEventListener("change", (_) => {
    if (fileDropZone.files && fileDropZone.files.length == 1) {
        const selectedFile = fileDropZone.files[0];
        load_file(selectedFile).then((xmlDoc) => {
            open_file(xmlDoc)
        });

    }
})

function open_file(xmlDoc: Document) {
    fileLoaderView.style.display = "none";
    xoppViewer.style.removeProperty("display");
    load_pages(xmlDoc);
}

function load_pages(xmlDoc: Document) {
    const pageRoot = document.querySelector("div.xopp-viewer div.content");

    const defaultRes = 5;
    
    const pages = xmlDoc.getElementsByTagName("page");
    for (const page of pages) {
        const pageWidth = parseInt(page.getAttribute("width")!);
        const pageHeight = parseInt(page.getAttribute("height")!);
        const newCanvas = document.createElement("canvas")
        newCanvas.width = pageWidth * defaultRes;
        newCanvas.height = pageHeight * defaultRes;
        const newPage = document.createElement("div");
        newPage.className = "page";
        newPage.style.width = "calc(var(--scale-factor) * " + pageWidth + "px)";
        newPage.style.height = "calc(var(--scale-factor) * " + pageHeight + "px)";
        pageRoot?.appendChild(newPage);
        newPage.appendChild(newCanvas)
        render_to_canvas(newCanvas, page);
    }
}
