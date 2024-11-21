import './style.scss'

const canvas = document.createElement("canvas");
document.querySelector<HTMLDivElement>('#app')!.appendChild(canvas);
const ctx = canvas.getContext("2d");

const parser = new DOMParser();
const xmlDoc = parser.parseFromString("", 'text/xml');

if (ctx) {
  ctx.fillStyle = "rgb(255 0 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
