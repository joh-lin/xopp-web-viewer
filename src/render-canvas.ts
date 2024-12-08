export function render_to_canvas(canvas: HTMLCanvasElement, pageXML: Element) {
    const pageWidth = parseInt(pageXML.getAttribute("width")!);
    const pageHeight = parseInt(pageXML.getAttribute("height")!);
    const scaleFactorX = canvas.width / pageWidth;
    const scaleFactorY = canvas.height / pageHeight;
    const scaleFactorAvg = scaleFactorX + (scaleFactorY - scaleFactorX)/2
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgb(255 255 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const stroke of pageXML.getElementsByTagName("stroke")) {
        const points = stroke.textContent?.split(" ").map(el => parseFloat(el))!
    ctx.beginPath();
    ctx.moveTo(points[0] * scaleFactorX, points[1] * scaleFactorY)
    ctx.lineWidth = parseFloat(stroke.getAttribute("width")!) * scaleFactorAvg;
    ctx.strokeStyle = stroke.getAttribute("color")!;
    for (let i = 2; i < points.length; i+=2) {
      ctx.lineTo(points[i] * scaleFactorX, points[i+1] * scaleFactorY)
    }
    ctx.stroke()
  }
}