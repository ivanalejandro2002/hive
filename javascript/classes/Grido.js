import {Cell} from './Cell.js';
export class Grido{
    constructor(size){

        let tablero = [[]];

        for(let i =0;i<size;++i){
            for(let j = 0; j<size; ++j){
                tablero[i].push(new Cell(false,0,0,"Z"));
            }
            tablero.push([]);
        }

        this.grid = tablero;
        this.isSelected = 0;
        this.selected = new Cell(false,0,0,"Z");
        this.availability = [];

        this.tileOrder = "QBGSAMLP";
        this.whiteLeft = [1,2,3,2,3,1,1,1];
        this.blackLeft = [1,2,3,2,3,1,1,1];

        this.whiteBeePlayed = false;
        this.blackBeePlayed = false;
        this.anythingPlayed = false;
        this.halfMoves = 1;
        this.moves = 1;
        this.size = size;
        this.turnoActual = 1;
        this.movements = [
            [{x: 1, y:0},
            {x: -1, y:0},
            {x: 0, y:1},
            {x: 0, y:-1},
            {x: -1, y:1},
            {x: -1, y:-1}],
            
            [{x: 1, y:0},
            {x: -1, y:0},
            {x: 0, y:1},
            {x: 0, y:-1},
            {x: 1, y:1},
            {x: 1, y:-1}]
        ]
    }

    verify(row,col){
        if(row<0 || row>=this.size)return false;
        var actualRow = Math.min(row,this.size-1-row);
        if(actualRow != Math.floor(this.size/2))actualRow = Math.floor(this.size/2-1)-actualRow;

        var l,r;
        var aumentol = 0;

        if(this.size%4==3)aumentol=1;
        l = Math.floor((actualRow+1+aumentol)/2);


        var aumentor = 0;
        if(this.size%4==1)aumentor = 1;

        r = this.size - Math.floor((actualRow+1+aumentor)/2)-1;
        
        if(row == Math.floor(this.size/2) || (col>=l && col<=r)){
          return true;
        }
        return false;
    }

    assign(celula,y,x){
        this.grid[y][x] = celula;
        this.turnoActual = (this.turnoActual+1)%2;
        this.halfMoves++;
        if(this.halfMoves%2==1)this.moves++;
    }

    erase(y,x){
        this.grid[y][x].exists = 0;
    }

    getAvailability(){
        if(this.anythingPlayed == false){
            this.availability.push({y: Math.floor(this.size/2),x: Math.floor(this.size/2)});
        }else if(this.halfMoves == 2){
            for(let i=0; i< this.movements[1].length; ++i){
                const newX = Math.floor(this.size/2) + this.movements[1][i].x;
                const newY = Math.floor(this.size/2) + this.movements[1][i].y;

                this.availability.push({y: newY, x:newX});
            }
        }else{
            if(this.selected.fromVoid){
                for(let j = 0; j < this.size;++j){
                    for(let k = 0; k < this.size;++k){
                        if(this.grid[j][k].exists == false || this.grid[j][k].color != this.turnoActual)continue;

                        for(let i=0; i< this.movements[0].length; ++i){
                            const newX = k + this.movements[j%2][i].x;
                            const newY = j + this.movements[j%2][i].y;

                            if(this.verify(newY,newX) == false)continue;
                            if(this.grid[newY][newX].exists)continue;

                            let surroundings = true;

                            for(let z = 0; z< this.movements[0].length;++z){
                                const newX2 = newX + this.movements[newY%2][z].x;
                                const newY2 = newY + this.movements[newY%2][z].y;
                                if(this.verify(newY2,newX2) == false || this.grid[newY2][newX2].exists==false)continue;
                                if(this.grid[newY2][newX2].color != this.turnoActual)surroundings = false;
                            }

                            if(surroundings == false)continue;

                            this.availability.push({y: newY, x:newX});
                        }
                    }
                }
            }
        }
    }

    dropPiece(){
        this.isSelected = false;
        this.selected.type = 'Z';
        this.availability.splice(0,this.availability.length);
    }

    resetPiece(){
        this.isSelected = false;
        this.selected = new Cell(false,0,0,"Z");
        this.availability.splice(0,this.availability.length);
    }
}