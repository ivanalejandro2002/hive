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
const maxDraggingMovement = 10;
let countAsClick = false;
let dragStart = { x: 0, y: 0 };
let screenDragStart = {x:0, y:0};
let actualSelection = {x:-100000, y:-100000};

let game = new Grido(1);

var cols = 1;
var rows = 1;

const hexSize = 40;

function initialize(gamesize){
  if(gamesize%2==0)gamesize++;

  //1 es blanco
  //0 es negro

  rows = cols = gamesize;
  game = new Grido(gamesize);

  document.getElementById("T").style.backgroundColor = "#f1f2f9";
  document.getElementById("T").style.textDecorationColor = "#0a122a";

  document.getElementById("Turno").style.color = "#0a122a";

  /*game.assign(new Cell(1,1,1,"B"),9,4);
  game.assign(new Cell(1,0,1,"B"),8,5);

  game.assign(new Cell(1,1,1,"Q"),5,5);
  game.assign(new Cell(1,0,1,"Q"),9,11);

  game.assign(new Cell(1,1,1,"G"),6,5);
  game.assign(new Cell(1,0,1,"G"),6,11);
  
  game.assign(new Cell(1,1,1,"S"),7,5);
  game.assign(new Cell(1,0,1,"S"),7,11);

  game.assign(new Cell(1,1,1,"A"),8,6);
  game.assign(new Cell(1,0,1,"A"),8,11);
  
  game.assign(new Cell(1,1,1,"M"),9,6);
  game.assign(new Cell(1,0,1,"M"),9,10);

  game.assign(new Cell(1,1,1,"L"),8,7);
  game.assign(new Cell(1,0,1,"L"),8,10);

  game.assign(new Cell(1,1,1,"P"),8,8);
  game.assign(new Cell(1,0,1,"P"),8,9);*/
  //game.erase(10,5);
}


function drawHexGrid() {
  actualSelection.x = -100000;
  actualSelection.y = -100000;
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

  if(game.isSelected == true){
    var fillColor;
    if(game.selected.type=='Q')fillColor = '#ead13d';
    if(game.selected.type=='S')fillColor = '#eb7619';
    if(game.selected.type=='P')fillColor = '#5ec1cd';
    if(game.selected.type=='M')fillColor = '#5a5a59';
    if(game.selected.type=='L')fillColor = '#d51116';
    if(game.selected.type=='G')fillColor = '#6fb63d';
    if(game.selected.type=='B')fillColor = '#514897';
    if(game.selected.type=='A')fillColor = '#3c62ac';
    for(let i=0;i<game.availability.length;i++){
      const col = game.availability[i].x;
      const row = game.availability[i].y;

      const x = col * hexWidth + (row % 2) * (hexWidth / 2);
      const y = row * vertSpacing;

      drawHexagon(x,y,hexSize/3,fillColor,1);
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

function distance(x1,y1,x2,y2){
  return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2) * (y1-y2));
}

function findSelectedHexagon(mouseX,mouseY){
  const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  const vertSpacing = 3 / 4 * hexHeight;
  let cellY = Math.round( ( mouseY-offsetY) / (vertSpacing * scale) );
  //const cellY = Math.round(mouseY/vertSpacing);
  let cellX = Math.round( ( mouseX - offsetX ) / (hexWidth * scale));
  //const cellX = Math.round(mouseX / hexWidth);

  const origX = cellX;
  const origY = cellY;

  let possibleX = (cellX * hexWidth + ((cellY %2) * hexWidth/2))*scale + offsetX;
  let possibleY = (cellY * vertSpacing) * scale + offsetY;

  let mejor = distance(possibleX, possibleY, mouseX,mouseY);
  
  let probeX,probeY,probeD;

  //Checa derecho
  probeX = ((origX+1) * hexWidth + ((origY %2) * hexWidth/2))*scale + offsetX;
  probeY = (origY * vertSpacing) * scale + offsetY;
  probeD = distance(probeX,probeY,mouseX,mouseY);

  if(probeD<mejor){
    mejor = probeD;
    cellX = origX +1;
    cellY = origY;
  }

  //checa izquierdo
  probeX = ((origX-1) * hexWidth + ((origY %2) * hexWidth/2))*scale + offsetX;
  probeY = (origY * vertSpacing) * scale + offsetY;
  probeD = distance(probeX,probeY,mouseX,mouseY);

  if(probeD<mejor){
    mejor = probeD;
    cellX = origX -1;
    cellY = origY;
  }

  //checa Abajo
  probeX = (origX * hexWidth + (((origX+1) %2) * hexWidth/2))*scale + offsetX;
  probeY = ((origY+1) * vertSpacing) * scale + offsetY;
  probeD = distance(probeX,probeY,mouseX,mouseY);

  if(probeD<mejor){
    mejor = probeD;
    cellX = origX;
    cellY = origY+1;
  }

  //checa Arriba
  probeX = (origX * hexWidth + (((origY-1) %2) * hexWidth/2))*scale + offsetX;
  probeY = ((origY-1) * vertSpacing) * scale + offsetY;
  probeD = distance(probeX,probeY,mouseX,mouseY);

  if(probeD<mejor){
    mejor = probeD;
    cellX = origX;
    cellY = origY -1;
  }

  probeX = (cellX * hexWidth + ((cellY %2) * hexWidth/2))*scale + offsetX;
  probeY = (cellY * vertSpacing) * scale + offsetY;
  
  if(cellX!=actualSelection.x || cellY!=actualSelection.y){
    drawHexGrid();
    drawHexagon(probeX, probeY,hexSize*scale,'#acc572',0.5);
    actualSelection.x = cellX;
    actualSelection.y = cellY;
  }
}

function clickea(gameCoords){
  if(game.isSelected){
    var found = false;
    for(var i = 0; i < game.availability.length; i++) {
      if (game.availability[i].x == gameCoords.x && game.availability[i].y == gameCoords.y) {
        found = true;
        break;
      }
    }
    if(found){

      if(game.selected.fromVoid == false){
        game.erase(game.selected.origin.y, game.selected.origin.x);
      }


      if(game.selected.fromVoid){
        swapColorsWithReduction();

        const destino = document.getElementById("T");
        const newBG = destino.style.textDecorationColor;
        const newAux = destino.style.backgroundColor;

        destino.style.textDecorationColor = newAux;
        destino.style.backgroundColor = newBG;

        document.getElementById("Turno").style.color = newAux;
        //reduceAmount();
      }

      game.selected.makeReal(gameCoords.x,gameCoords.y);
      game.assign(game.selected,gameCoords.y,gameCoords.x);
      game.resetPiece();

      drawHexGrid();

      game.anythingPlayed = true;
    }else{
      restoreColors();
      game.dropPiece();
      drawHexGrid();
    }
  }
}

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  countAsClick = true;
  dragStart.x = e.clientX - offsetX;
  dragStart.y = e.clientY - offsetY;
  screenDragStart.x = e.clientX;
  screenDragStart.y = e.clientY;
});

canvas.addEventListener("mouseup", (e) =>{
  isDragging = false
  if(countAsClick){
    clickea(actualSelection);
  }
});
canvas.addEventListener("mouseleave", () => isDragging = false);

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    offsetX = e.clientX - dragStart.x;
    offsetY = e.clientY - dragStart.y;

    if(countAsClick){
      const deltaX = e.clientX - screenDragStart.x;
      const deltaY = e.clientY - screenDragStart.y;
      if(Math.sqrt(deltaX*deltaX + deltaY*deltaY)>maxDraggingMovement)
        countAsClick = false;
    }
    if(countAsClick == false)
      drawHexGrid();
  }else{
    findSelectedHexagon(e.clientX,e.clientY);
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
    {value: -50, duration:100, easing: 'easeInOutSine'},
    {value: 0, duration: 100, easing: 'easeInOutSine'},
    
  ],
  rotate: {
    value: '1turn',
    easing: 'easeInOutSine'
  },
  delay: function(el,i,l){
    return i * 200;
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


const buttonElements = document.getElementsByClassName("box");

for(let i =0; i<buttonElements.length;i++){
  buttonElements[i].addEventListener('click',function(){
    clickedButton(buttonElements[i]);
  });
}

function assignAmount(target,count){
  const restorer = document.getElementById(target);

  const left = count;

  document.getElementById("C" + target).innerHTML = left.toString();

  if(left>0)restoreColorsOf(target);
  else restorer.style.backgroundColor = "#414141";
}

function swapColorsWithReduction(){
  let idx = 0;
  for(let i = 0 ; i < game.tileOrder.length;i++){
    if(game.tileOrder[i] == game.selected.type) idx = i;
  }

  if(game.turnoActual == 0)game.blackLeft[idx]--;
  else game.whiteLeft[idx]--;

  if(game.turnoActual == 0){
    for(let i =0 ;i < 8;++i){
      assignAmount(game.tileOrder[i],game.whiteLeft[i]);
    }
  }else{
    for(let i =0 ;i < 8;++i){
      assignAmount(game.tileOrder[i],game.blackLeft[i]);
    }
  }
}

function reduceAmount(){
  const restorer = document.getElementById(game.selected.type);

  const left = parseInt(document.getElementById("C"+game.selected.type).innerHTML) - 1;

  document.getElementById("C" + game.selected.type).innerHTML = left.toString();

  if(left>0)restoreColors();
  else restorer.style.backgroundColor = "#414141";
}

function restoreColorsOf(target){
  const restorer = document.getElementById(target);

  restorer.style.backgroundColor = restorer.style.textDecorationColor;
}

function restoreColors(){
  const restorer = document.getElementById(game.selected.type);

  restorer.style.backgroundColor = restorer.style.textDecorationColor;
}

function clickedButton(tile){
  if(tile.id == 'T')return;

  const id = tile.id;
  const forId = "#" + id;

  const left = parseInt(document.getElementById("C"+id).innerHTML);
  if(left<=0){
    if(game.isSelected){
      restoreColors();

      game.dropPiece();
    }
    return;
  }

  
  anime({
    targets: forId,
    scale:[
      {value: 1.1, duration:100},
      {value: 1, duration: 100},
    ],
  });

  if(game.isSelected){
    restoreColors();
  }

  if(game.selected.type!= id){
    tile.style.backgroundColor = "white";

    game.isSelected = true;

    let originalAmount;
    if(id=='Q' || id=='M' || id=='L' || id=='P')originalAmount = 1;
    if(id=='B' || id=='S')originalAmount = 2;
    if(id=='G' || id == 'A')originalAmount = 3;

    const actual = originalAmount+1-left;
    game.selected = new Cell(1,game.turnoActual,actual,id);

    game.getAvailability();

  }else{
    game.dropPiece();
  }

  drawHexGrid();
}