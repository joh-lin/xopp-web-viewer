interface PageRenderContext {
  canvas: HTMLCanvasElement;
  pageXML: Element;
  ctx: CanvasRenderingContext2D;
  pageWidth: number;
  pageHeight: number;
  scaleFactorX: number;
  scaleFactorY: number;
  scaleFactor: number;
}


export function render_to_canvas(canvas: HTMLCanvasElement, pageXML: Element): void {
  const ctx = canvas.getContext("2d")!;
  const pageWidth = parseInt(pageXML.getAttribute("width")!);
  const pageHeight = parseInt(pageXML.getAttribute("height")!);
  const scaleFactorX = canvas.width / pageWidth;
  const scaleFactorY = canvas.height / pageHeight;
  const scaleFactor = (scaleFactorY + scaleFactorX) / 2

  const pageRC: PageRenderContext = {
    canvas,
    pageXML,
    ctx,
    pageWidth,
    pageHeight,
    scaleFactorX,
    scaleFactorY,
    scaleFactor,
  };

  render_background(pageRC);
  render_content(pageRC);
}

function create_background_pattern(pageRC: PageRenderContext, style: string | null, color: string): CanvasPattern {
  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = pageRC.scaleFactorX * 14.3;
  bgCanvas.height = pageRC.scaleFactorY * 14.3;
  const ctx = bgCanvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  if (style === "graph") {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = pageRC.scaleFactor * 0.4;
    ctx.beginPath();
    ctx.moveTo(0, bgCanvas.height);
    ctx.lineTo(bgCanvas.width, bgCanvas.height);
    ctx.lineTo(bgCanvas.height, 0);
    ctx.stroke();
  }
  return pageRC.ctx.createPattern(bgCanvas, "repeat")!;
}

function render_background(pageRC: PageRenderContext): void {
  const bgElement = pageRC.pageXML.getElementsByTagName("background")[0];
  const bgStyle = bgElement.getAttribute("style");
  const bgColor = bgElement.getAttribute("color")!;
  pageRC.ctx.fillStyle = create_background_pattern(pageRC, bgStyle, bgColor);
  pageRC.ctx.fillRect(0, 0, pageRC.canvas.width, pageRC.canvas.height);
}


function render_content(pageRC: PageRenderContext): void {
  for (const layer of pageRC.pageXML.getElementsByTagName("layer")) {
    for (const elem of layer.children) {
      switch (elem.tagName) {
        case "stroke":
          render_stroke(pageRC, elem);
          break;
        case "text":
          render_text(pageRC, elem);
          break;
        default:
          console.log("Unknown Element in render_content()");
          console.log(elem);
          break;
      }
    }
  }
}

function render_stroke(pageRC: PageRenderContext, strokeElem: Element) {
  const ctx = pageRC.ctx;
  const points = strokeElem.textContent?.split(" ").map(el => parseFloat(el))!
  ctx.beginPath();
  ctx.moveTo(points[0] * pageRC.scaleFactorX, points[1] * pageRC.scaleFactorY)
  ctx.lineWidth = parseFloat(strokeElem.getAttribute("width")!) * pageRC.scaleFactor;
  ctx.strokeStyle = strokeElem.getAttribute("color")!;
  ctx.lineJoin = "round";
  switch (strokeElem.getAttribute("capStyle")) {
    case "round":
      ctx.lineCap = "round";
      break;
    default:
      break;
  }
  switch (strokeElem.getAttribute("style")) {
    case "dash":
      ctx.setLineDash([30, 30]);
      break;
    case "dot":
      ctx.setLineDash([1, 30])
      break;
    case "dashdot":
      ctx.setLineDash([1, 25, 25, 25])
      break;
    default:
      ctx.setLineDash([]);
      break;
  }
  for (let i = 2; i < points.length; i += 2) {
    ctx.lineTo(points[i] * pageRC.scaleFactorX, points[i + 1] * pageRC.scaleFactorY)
  }
  ctx.stroke()
}


function render_text(pageRC: PageRenderContext, textElem: Element) {
  const ctx = pageRC.ctx;
  const fontSize = parseFloat(textElem.getAttribute("size")!);
  const x = parseFloat(textElem.getAttribute("x")!);
  const y = parseFloat(textElem.getAttribute("y")!);
  const fontFamily = textElem.getAttribute("font");
  ctx.font = fontSize * pageRC.scaleFactor + "px/0 " + fontFamily;
  ctx.fillStyle = textElem.getAttribute("color")!;
  ctx.textBaseline = "top";
  const textSnippets = textElem.textContent?.split("\n") || []
  for (let i = 0; i < textSnippets?.length; i++) {
    ctx.fillText(textSnippets[i], x * pageRC.scaleFactorX, (y + i * fontSize) * pageRC.scaleFactorY);
  }
}