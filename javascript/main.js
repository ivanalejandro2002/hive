import {Cell} from './classes/Cell.js';
import {Grido} from './classes/Grido.js';

const canvas = document.getElementById("Juego");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight - 150;
canvas.width = width;
canvas.height = height;

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

let game = new Grido(1);

var cols = 1;
var rows = 1;

const hexSize = 40;

function initialize(gamesize){
  if(gamesize%2==0)gamesize++;

  rows = cols = gamesize;
  game = new Grido(gamesize);
  game.assign(new Cell(1,1,1,"B"),10,5);
  game.assign(new Cell(1,0,1,"B"),8,5);

  game.assign(new Cell(1,1,1,"Q"),5,5);
  game.assign(new Cell(1,0,1,"Q"),9,11);

  game.assign(new Cell(1,1,1,"G"),6,5);
  game.assign(new Cell(1,0,1,"G"),6,11);
  
  game.assign(new Cell(1,1,1,"S"),7,5);
  game.assign(new Cell(1,0,1,"S"),7,11);

  game.assign(new Cell(1,1,1,"A"),8,6);
  game.assign(new Cell(1,0,1,"A"),8,11);
  //game.erase(10,5);
}


function drawHexGrid() {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  const vertSpacing = 3 / 4 * hexHeight;

  const startX = -offsetX / scale - hexWidth;
  const startY = -offsetY / scale - hexHeight;


  //Tablero original
  for (let row = rows-1; row >=0; row--) {
    for (let col = cols-1; col >=0; col--) {
      const x = col * hexWidth + (row % 2) * (hexWidth / 2);
      const y = row * vertSpacing;

      // Alternancia de color tipo tablero
      var fillColor;
      let cambio = row%2;
      let alpha = 1;
      if(((col-cambio+3)%3==0))fillColor = '#a76545';
      if(((col-cambio+3)%3==1))fillColor = '#ffa55d';
      if(((col-cambio+3)%3==2))fillColor = '#ffdf88';

      if (x > startX-hexWidth/2 && y > startY-hexHeight/2 && x < startX + width / scale + 3*hexWidth/2 && y < startY + height / scale + 3*hexHeight/2) {
        var actualRow = Math.min(row,rows-1-row);
        if(actualRow != Math.floor(rows/2))actualRow = Math.floor(rows/2-1)-actualRow;

        var l,r;
        var aumentol = 0;

        if(rows%4==3)aumentol=1;
        l = Math.floor((actualRow+1+aumentol)/2);


        var aumentor = 0;
        if(rows%4==1)aumentor = 1;

        r = cols - Math.floor((actualRow+1+aumentor)/2)-1;
        
        if(row == Math.floor(rows/2) || (col>=l && col<=r)){
          drawHexagon(x, y, hexSize, fillColor,1);
        }


      }
    }
  }



  for (let row = 0; row <rows; ++row) {
    for (let col =0; col <cols; ++col) {
      
      const x = col * hexWidth + (row % 2) * (hexWidth / 2);
      const y = row * vertSpacing;

      if(!game.grid[row][col].exists){
        var actualRow = Math.min(row,rows-1-row);
        if(actualRow != Math.floor(rows/2))actualRow = Math.floor(rows/2-1)-actualRow;

        var l,r;
        var aumentol = 0;

        if(rows%4==3)aumentol=1;
        l = Math.floor((actualRow+1+aumentol)/2);


        var aumentor = 0;
        if(rows%4==1)aumentor = 1;

        r = cols - Math.floor((actualRow+1+aumentor)/2)-1;
        
        if(row == Math.floor(rows/2) || (col>=l && col<=r)){
          ctx.fillStyle = "#000000";
          ctx.fillText(row.toString()+','+col.toString(),x,y);
        }
        continue;
      }

      // Alternancia de color tipo tablero
      var fillColor;
      let cambio = row%2;
      let alpha = 1;

      //Color de la ficha
      if(game.grid[row][col].color==0)fillColor = '#0a122a';
      else fillColor = "#f1f2f9";
      alpha = 0.2

      if (x > startX-hexWidth/2 && y > startY-hexHeight/2 && x < startX + width / scale + 3*hexWidth/2 && y < startY + height / scale + 3*hexHeight/2) {
        var actualRow = Math.min(row,rows-1-row);
        if(actualRow != Math.floor(rows/2))actualRow = Math.floor(rows/2-1)-actualRow;

        var l,r;
        var aumentol = 0;

        if(rows%4==3)aumentol=1;
        l = Math.floor((actualRow+1+aumentol)/2);


        var aumentor = 0;
        if(rows%4==1)aumentor = 1;

        r = cols - Math.floor((actualRow+1+aumentor)/2)-1;
        
        if(row == Math.floor(rows/2) || (col>=l && col<=r)){
          //sombra
          drawHexagon(x, y + 6, hexSize, '#080808',alpha);
          
          //ficha
          drawHexagon(x, y, hexSize, fillColor,1);
          
          //Bicho
          const origin = '../models/'+game.grid[row][col].type+'.svg';
          var img = new Image();
          img.src = origin;
          ctx.drawImage(img, x-hexWidth/3, y-hexHeight/3, 2*hexWidth/3,2*hexHeight/3);
          
          drawBrights(x,y,hexSize);

          if(game.grid[row][col].color == 1)
            ctx.fillStyle = "#000000";
          else ctx.fillStyle = "#ffffff";
          ctx.fillText(row.toString()+','+col.toString(),x,y);
        }


      }
    }
  }

  ctx.restore();
}

function drawBrights(x,y,size){
  ctx.globalAlpha = 0.5;
  const angle_deg = 60;

  const thickness = size/10;


  ctx.beginPath();
  ctx.moveTo(x, y)
  //ctx.lineTo(100, 150)

  for(let i = 3; i< 6;i++){
    const angle_rad = (Math.PI/180) * (angle_deg * i +30);
    const px = x + (size - 3*thickness/2) * Math.cos(angle_rad);
    const py = y + (size - 3*thickness/2) * Math.sin(angle_rad);
    if(i == 3)ctx.moveTo(px,py); 
    else ctx.lineTo(px,py); 
  }

  ctx.lineWidth = thickness
  ctx.strokeStyle = "#ffffff"
  ctx.lineCap = "round";
  ctx.stroke();
  


  ctx.beginPath();
  ctx.moveTo(x, y)
  //ctx.lineTo(100, 150)

  for(let i = 0; i< 3;i++){
    const angle_rad = (Math.PI/180) * (angle_deg * i +30);
    const px = x + (size - 3*thickness/2) * Math.cos(angle_rad);
    const py = y + (size - 3*thickness/2) * Math.sin(angle_rad);
    if(i == 0)ctx.moveTo(px,py); 
    else ctx.lineTo(px,py); 
  }

  ctx.lineWidth = thickness
  ctx.strokeStyle = "#222222"
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawHexagon(x, y, size, fillColor, alpha) {
  ctx.globalAlpha = alpha;
  const angle_deg = 60;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle_rad = (Math.PI / 180) * (angle_deg * i + 30);
    const px = x + size * Math.cos(angle_rad);
    const py = y + size * Math.sin(angle_rad);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.globalAlpha = 1;
}

function zoom(event) {
  event.preventDefault();
  const zoomIntensity = 0.1;
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  const wheel = event.deltaY < 0 ? 1 : -1;
  const zoomFactor = Math.exp(wheel * zoomIntensity);

  const wx = (mouseX - offsetX) / scale;
  const wy = (mouseY - offsetY) / scale;

  scale *= zoomFactor;
  offsetX = mouseX - wx * scale;
  offsetY = mouseY - wy * scale;

  drawHexGrid();
}

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStart.x = e.clientX - offsetX;
  dragStart.y = e.clientY - offsetY;
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    offsetX = e.clientX - dragStart.x;
    offsetY = e.clientY - dragStart.y;
    drawHexGrid();
  }
});

canvas.addEventListener("wheel", zoom);

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight -150;
  canvas.width = width;
  canvas.height = height;
  drawHexGrid();
});


initialize(15);
drawHexGrid();
anime({
  targets: 'div.box',
  translateY:[
    {value: 200, duration:500},
    {value: 0, duration: 500},
  ],
  rotate: {
    value: '1turn',
    easing: 'easeInOutSine'
  },
  delay: function(el,i,l){
    return i * 1000;
  }
});
/*anime({
  targets: 'div.box.red',
  translateY:[
    {value: 200, duration:500},
    {value: 0, duration: 500},
  ],
  rotate: {
    value: '1turn',
    easing: 'easeInOutSine'
  }
});

anime({
  targets: 'div.box.blue',
  translateY:[
    {value: 200, duration:500, delay: 1000},
    {value: 0, duration: 500},
  ],
  rotate: {
    value: '1turn',
    easing: 'easeInOutSine',
    delay: 1000,
  }
});

anime({
  targets: 'div.box.green',
  translateY:[
    {value: 200, duration:500, delay: 2000},
    {value: 0, duration: 500},
  ],
  rotate: {
    value: '1turn',
    easing: 'easeInOutSine',
    delay: 2000,
  }
});

anime({
  targets: 'div.box.yellow',
  translateY:[
    {value: 200, duration:500, delay: 3000},
    {value: 0, duration: 500},
  ],
  rotate: {
    value: '1turn',
    easing: 'easeInOutSine',
    delay: 3000,
  }
});*/

