import './style.scss'

const canvases = document.getElementsByTagName("canvas")
for (const canvas of canvases) {
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}